function deleteExercise(id){
    $.ajax({
        url: '/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}