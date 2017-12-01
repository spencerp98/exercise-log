function updateExercise(id){
    $.ajax({
        url: '/' + id,
        type: 'PUT',
        data: $('#update-exercise').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}