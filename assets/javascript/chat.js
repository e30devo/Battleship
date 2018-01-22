$(document).ready(function(){



  var database = firebase.database();
<<<<<<< Updated upstream
  var thisGame = $("#signOut").attr("data-game")
  console.log(thisGame);
=======

>>>>>>> Stashed changes
  database.ref().once("value", function(snapshot) {
      console.log(snapshot.val());

  }); 


<<<<<<< Updated upstream
  database.ref().on("child_added", function(snapshot) {
    
=======
  database.ref().on("child_added", function(snapshot, prevChildKey){
    console.log(snapshot.val(), prevChildKey);
>>>>>>> Stashed changes
  })    
  $(".chatbox").keyup(function(event) {
    if (event.keyCode === 13) {
        database.ref().once("value", function(snapshot) {
         console.log(Object.keys(snapshot.val())); 
        $(".chatbox").click()        
        var message = $(".chatbox").val();        
        $(".chatHistory").append("<li>" + message);
        // database.ref().push({
        //     prevChildKey, opponent: message
        //   });
        });
    }

});
});

/////////////////////////////////////////////////////////////
// $('#send-btn').on('click', function(){
// 	var new_message = $('#message-input').val();
// 	update_chat(new_message);
// });

// function update_chat(new_message){
// 	chat_messages.push(new_message);
// 	if(chat_messages.length > 4){
// 		chat_messages.splice(1,1);
// 	}
// 	database.ref().update({
// 		chat: chat_messages
// 	});
// }


// database.ref('chat').on('value', function(snapshot){
// 	chat_messages = snapshot.val();
// 	// console.log(chat_messages);
// 	print_chat();
// });

// function print_chat(){
// 	$('#control .chat-box').empty();
// 	for(var i=0; i<chat_messages.length; i++){
// 		$('#control .chat-box').append('<li class="list-group-item">' + chat_messages[i] + '</li>');
// 	}
// }