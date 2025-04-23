import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";

function Home() {
  //first will send authorized request to grab all the notes created by the user
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    //calls the getNote function when we load the page
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((response) => response.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note Deleted");
        else alert("Error Deleting Note");
        getNotes(); //best practice should be instead of regetting all notes to just remove the note from the state on the front end (notes array)
      })
      .catch((error) => {
        if (error.response?.status === 401) alert("You need to authenticate");
        else alert(error);
      });
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note Created");
        else alert("Error Creating Note");
        getNotes(); //best practice should be instead of regetting all notes to just add the note to the state on the front end (notes array)
      })
      .catch((error) => {
        if (error.response?.status === 401) alert("You need to authenticate");
        else alert(error);
      });
  };
  /**
   * Using a form OnSubmit vs form action reloads just the form and not the whole page vs form action reloads the whole page
   */
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Note</h2>
        <form onSubmit={createNote} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
