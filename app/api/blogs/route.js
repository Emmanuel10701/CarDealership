import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

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
// 🚀 POST: Create New Blog Post (Independent)
// ====================================================================
export async function POST(request) {
    try {
        const formData = await request.formData();

        // 1. Extract Fields
        const title = formData.get("title")?.toString().trim() || "";
        const excerpt = formData.get("excerpt")?.toString().trim() || "";
        const content = formData.get("content")?.toString().trim() || "";
        const authorName = formData.get("authorName")?.toString().trim() || "Admin"; 
        const status = formData.get("status")?.toString().trim().toUpperCase() || "DRAFT";
        const featured = formData.get("featured") === 'true';
        const category = formData.get("category")?.toString().trim();
        const tagsInput = formData.get("tags")?.toString() || "";
        
        // SEO Fields - ADDED
        const metaTitle = formData.get("metaTitle")?.toString().trim() || "";
        const metaDescription = formData.get("metaDescription")?.toString().trim() || "";
        const imageAltText = formData.get("imageAltText")?.toString().trim() || "";

        // FIX: Convert tags array to string for database storage
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag).join(', ');

        // 2. Handle Image Upload
        const mainImageFile = formData.get("mainImageFile");
        let mainImagePath = null;
        if (mainImageFile && mainImageFile.name && mainImageFile.size > 0) {
             const buffer = Buffer.from(await mainImageFile.arrayBuffer());
             const fileExt = mainImageFile.name.split('.').pop() || 'jpg';
             const fileName = `${createSlug(title)}-${Date.now()}.${fileExt}`;
             const filePath = path.join(uploadDir, fileName);
             await writeFile(filePath, buffer);
             mainImagePath = `/blogimages/${fileName}`; 
        }

        // 3. Generate Meta fields
        const slug = createSlug(title);
        const readTime = calculateReadTime(content);
        const publishDate = status === 'PUBLISHED' ? new Date() : null;

        const blogPost = await prisma.blogPost.create({
            data: {
                slug, 
                title, 
                excerpt, 
                content, 
                authorName, 
                status, 
                featured, 
                category, 
                readTime,
                tags,
                mainImage: mainImagePath,
                // SEO Fields - ADDED
                imageAltText: imageAltText || title,
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || excerpt,
                publishDate,
            },
        });

        return NextResponse.json(
            { success: true, message: "Blog post created successfully", post: blogPost },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to create blog post" },
            { status: 500 }
        );
    }
}

// ====================================================================
// 🔹 GET: Fetch All Blog Posts (Admin View)
// ====================================================================
export async function GET() {
    try {
        const blogPosts = await prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
        });

        // FIX: Parse tags string back to array for frontend consumption
        const parsedPosts = blogPosts.map(post => ({
            ...post,
            tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
            // SEO Fields are automatically included from the database
        }));

        return NextResponse.json({ success: true, blogPosts: parsedPosts }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to fetch blog posts" },
            { status: 500 }
        );
    }
}