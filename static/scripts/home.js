/*
$("#l_input").on({
    "click": function () {

        $('#language').change(function (e) {
            $("#language_form").submit();
            console("ok")
            return false
        })

    },
});
*/

$("#l_input").on({
    "click": function () {

        console.log('ok');
        $("#change_language_form").submit();
        return false;

    },
});


$("#commencer").on({
    "click": function () {

        let nb_pers = $("#inputNb").val();
        console.log('okk');

        $.ajax({
            url: 'jeu/game.html',
            type: 'post',
            dataType: 'html',
            data: { 'nb_pers': nb_pers },
            success: function (data) {  //如果请求成功，返回数据。
                $("#wordlist").html(data);
            },
        });

    },
});

