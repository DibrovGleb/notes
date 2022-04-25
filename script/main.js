const notesContainer = document.getElementById("app"),
      addNoteButton = notesContainer.querySelector(".add-note"),
      deleteAllButton = notesContainer.querySelector(".delete-all"),
      menu = document.querySelector('.change'),
      fontUp = document.getElementById('up'),
      fontDown = document.getElementById('down'),
      fontStyle = document.getElementById('font-style');

getNotes().forEach((note) => {
  const noteElement = createNoteElement(note.id, note.content);
  notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());
deleteAllButton.addEventListener("click", ()=> deleteAllNotes());

function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
  const container = document.createElement('div'),
        element = document.createElement('textarea'),
        closeIcon = document.createElement("img");
  closeIcon.src = 'icons/close.png';
  container.classList.add('container');
 
  container.appendChild(element);
  container.appendChild(closeIcon);
  element.classList.add("note");
  element.placeholder = "Пустая заметка";
  element.value = content;

  element.addEventListener("change", () => updateNote(id, element.value));

  element.addEventListener("click", (e)=>{
    let coord = element.getBoundingClientRect(),
        curr = e.target;
    menu.style.cssText = `display:flex; top:${coord.top}px; left:${coord.left}px;`;
    fontUp.addEventListener("click", ()=> curr.style.fontSize = parseFloat(getComputedStyle(curr).fontSize) + 1 +"px")
    fontDown.addEventListener("click", ()=> curr.style.fontSize = parseFloat(getComputedStyle(curr).fontSize) - 1 +"px")
    fontStyle.addEventListener("change", ()=> curr.style.fontFamily = fontStyle.value)
  })
  
  closeIcon.addEventListener("click", () => deleteNote(id, container));

  return container;
}

function addNote() {
  const notes = getNotes(),
        noteObject = {
            id: Math.floor(Math.random() * 1000),
            content: ""
        },
        noteElement = createNoteElement(noteObject.id, noteObject.content);
  
  menu.style.cssText = `display:none;`;
  notesContainer.insertBefore(noteElement, addNoteButton);

  notes.push(noteObject);
  saveNotes(notes);
}

function updateNote(id, newContent) {
  const notes = getNotes(),
        targetNote = notes.filter((note) => note.id === id)[0];
  
  targetNote.content = newContent;
  saveNotes(notes);
}

function deleteNote(id, container) {
  const notes = getNotes().filter((note) => note.id != id);
  menu.style.cssText = `display:none;`;
  saveNotes(notes);
  notesContainer.removeChild(container);
}

function deleteAllNotes(){
  menu.style.cssText = `display:none;`;
  if (notesContainer.childElementCount > 2){
    if(confirm("Вы уверены что хотите удалить все заметки?")){
      while (notesContainer.childElementCount != 2){
        notesContainer.removeChild(notesContainer.firstChild);
      }
      localStorage.clear()
    }}
  else alert("Все заметки удалены!");
}

if(document.cookie === "") addNote()
document.cookie = "user=visited; max-age=3600";