import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
		// The array of all notes, lazy load the the initial data
    const [notes, setNotes] = React.useState(
			() => JSON.parse(localStorage.getItem("notes")) || []
		)
		// The current note being worked on
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
		// Save notes to local storage every time a the notes state is changed.
		React.useEffect(() => {
			localStorage.setItem("notes", JSON.stringify(notes))
		}, [notes])

		// Creates a new note
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)

    }
    
		// Updates an existing note if edited.
		// Pushes note to top of list on sidebar
    function updateNote(text) {
			setNotes(oldNotes => {

				const newArray = []

				for (let i = 0; i < oldNotes.length; i++) {
					
					if (oldNotes[i].id === currentNoteId)
						newArray.unshift({...oldNotes[i], body: text})
					else
						newArray.push(oldNotes[i])
				}

				return newArray
			})
    }
		
		// Deletes a note 
		function deleteNote(event, noteId) {
			// Stops the click from clicking the parent.
			event.stopPropagation()
			
			// Don't include the  note (nodeId) in the returned array
			setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
		}
    
		// Finds the current note so that it can be highlighted in CSS
    function findCurrentNote() {
			return notes.find(note => {
					return note.id === currentNoteId
			}) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
										deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
