import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile, unlink } from "fs/promises";

// Configuration & Helpers
const uploadDir = path.join(process.cwd(), "public/blogimages");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
};

const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return `${Math.ceil(words / wordsPerMinute)} min read`;
};

// ====================================================================
// 🔹 GET: Get single post by ID
// ====================================================================
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        
        const blogPost = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!blogPost) {
            return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
        }

        // Parse tags from string to array for frontend
        const parsedPost = {
            ...blogPost,
            tags: blogPost.tags ? blogPost.tags.split(',').map(tag => tag.trim()) : [],
        };

        return NextResponse.json({ success: true, blogPost: parsedPost }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// ====================================================================
// ✏️ PUT: Update Existing Blog Post
// ====================================================================
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const updatedData = {};
        
        // 1. Extract Fields
        const title = formData.get("title")?.toString().trim();
        const excerpt = formData.get("excerpt")?.toString().trim();
        const content = formData.get("content")?.toString().trim();
        const authorName = formData.get("authorName")?.toString().trim();
        const status = formData.get("status")?.toString().trim().toUpperCase();
        const featured = formData.get("featured");
        const category = formData.get("category")?.toString().trim();
        const tagsInput = formData.get("tags")?.toString();
        const imageAltText = formData.get("imageAltText")?.toString().trim();
        const metaTitle = formData.get("metaTitle")?.toString().trim();
        const metaDescription = formData.get("metaDescription")?.toString().trim();

        // Handle all fields properly
        if (title) updatedData.title = title;
        if (excerpt) updatedData.excerpt = excerpt;
        if (content) updatedData.content = content;
        if (authorName) updatedData.authorName = authorName;
        if (status) updatedData.status = status;
        if (featured !== null && featured !== undefined) {
            updatedData.featured = featured === 'true';
        }
        if (category !== undefined) updatedData.category = category;
        if (imageAltText !== undefined) updatedData.imageAltText = imageAltText;
        if (metaTitle !== undefined) updatedData.metaTitle = metaTitle;
        if (metaDescription !== undefined) updatedData.metaDescription = metaDescription;

        // Tags update - convert to string for database storage
        if (tagsInput !== undefined) {
            const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            updatedData.tags = tagsArray.join(', ');
        }

        // Generate dynamic fields
        if (title) updatedData.slug = createSlug(title);
        if (content) updatedData.readTime = calculateReadTime(content);
        if (status === 'PUBLISHED') {
            updatedData.publishDate = new Date();
        } else if (status === 'DRAFT') {
            updatedData.publishDate = null;
        }
        
        // 2. Image Handling
        const currentPost = await prisma.blogPost.findUnique({ 
            where: { id }, 
            select: { mainImage: true, title: true } 
        });

        if (!currentPost) {
            return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
        }

        const mainImageFile = formData.get("mainImageFile"); 

        if (mainImageFile && mainImageFile.name && mainImageFile.size > 0) {
            // New file upload: Delete old one & save new one
            if (currentPost.mainImage) { 
                try { 
                    await unlink(path.join(process.cwd(), "public", currentPost.mainImage)); 
                } catch (e) {
                    // Continue if old image cannot be deleted
                } 
            }
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const fileExt = mainImageFile.name.split('.').pop() || 'jpg';
            const fileName = `${createSlug(title || currentPost.title)}-${Date.now()}.${fileExt}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            updatedData.mainImage = `/blogimages/${fileName}`;
        }
        
        // 3. Update in Database
        const updatedPost = await prisma.blogPost.update({
            where: { id },
            data: updatedData,
        });

        // Parse tags for response
        const parsedPost = {
            ...updatedPost,
            tags: updatedPost.tags ? updatedPost.tags.split(',').map(tag => tag.trim()) : [],
        };

        return NextResponse.json({ 
            success: true, 
            message: "Blog post updated successfully", 
            post: parsedPost 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message, 
            message: "Failed to update blog post" 
        }, { status: 500 });
    }
}

// ====================================================================
// 🗑️ DELETE: Delete Blog Post
// ====================================================================
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const existingPost = await prisma.blogPost.findUnique({ 
            where: { id }, 
            select: { mainImage: true } 
        });
        
        if (!existingPost) {
            return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
        }

        await prisma.blogPost.delete({ where: { id } });

        // Delete associated image from filesystem
        if (existingPost.mainImage) {
            try {
                await unlink(path.join(process.cwd(), "public", existingPost.mainImage));
            } catch (fileError) {
                // Continue if image deletion fails
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: "Blog post deleted successfully" 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message, 
            message: "Failed to delete blog post" 
        }, { status: 500 });
    }
}