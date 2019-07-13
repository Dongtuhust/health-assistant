try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
}


var noteTextarea = $('#note-textarea');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
        submitInput();
    }
};



/*-----------------------------
      App buttons and input
------------------------------*/
$(document).on('click', '.start-record-btn', function(e){
    e.preventDefault();
    $(".voice-img").addClass("save-note-btn");
    $(".voice-img").removeClass("start-record-btn");
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
});
// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
})
$(document).on('click', '.save-note-btn', function (e) {
    e.preventDefault();
    $(".voice-img").addClass("start-record-btn");
    $(".voice-img").removeClass("save-note-btn");
    recognition.stop();
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    // saveNote(new Date().toLocaleString(), noteContent);

    // Reset variables and update UI.
    noteContent = '';
    renderNotes(getAllNotes());
    noteTextarea.val('');
})






/*-----------------------------
      Speech Synthesis
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 3;

    window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions
------------------------------*/

function renderNotes(notes) {
    // var html = '';
    // if (notes.length) {
    //     notes.forEach(function(note) {
    //         html += `<li class="note">
    //     <p class="header">
    //       <span class="date">${note.date}</span>
    //       <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
    //       <a href="#" class="delete-note" title="Delete">Delete</a>
    //     </p>
    //     <p class="content">${note.content}</p>
    //   </li>`;
    //     });
    // } else {
    //     html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    // }
    // notesList.html(html);
}


function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);

        if (key.substring(0, 5) == 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: localStorage.getItem(localStorage.key(i))
            });
        }
    }
    return notes;
}


function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
}