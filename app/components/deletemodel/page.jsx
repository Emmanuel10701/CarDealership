// components/modals/DeleteConfirmationModal.js
"use client"

import { FaTrash, FaTimes } from 'react-icons/fa'

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  item 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaTrash className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Delete {item?.type || 'Item'}</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>"{item?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 font-medium"
            >
              Delete {item?.type || 'Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}