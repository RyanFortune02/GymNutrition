import { StrictMode } from "react";

function Note({ note, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US"); //formats the date to a more readable format ,can use for chat messaging and displaying times

  return (
    <div className="p-4 my-5 border border-gray-300 rounded-lg shadow-sm">
      <p className="text-lg font-semibold text-gray-800">{note.title}</p>
      <p className="text-gray-600 my-2">{note.content}</p>
      <p className="text-sm text-gray-500">{formattedDate}</p>
      <button 
        className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default Note;
