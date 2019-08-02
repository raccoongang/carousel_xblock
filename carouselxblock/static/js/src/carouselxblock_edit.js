function crouselXBlockInitEdit(runtime, element) {
    $('.add_input_url').on('click', function(){
        $('.img_url_fields').append(
            '<div class="wrapper-comp-setting">' +
                '<label class="label setting-label" for="url"> "New url" </label>' +
                '<input class="input setting-input url" value="" type="text">' +
                '<a href="#" class="delete_input_url"> X </a>' +
            '</div>'
        )
    });
    
    $('.img_url_fields').delegate('.delete_input_url', 'click', function(){
        $( this ).parent( ".wrapper-comp-setting" ).remove();
    });

    $(element).find('.action-cancel').bind('click', function () {
        runtime.notify('cancel', {});
    });

    $(element).find('.action-save').bind('click', function () {

        var url_array = $( ".input.setting-input.url" ).map(function() {
            return $( this ).val()
        })
        .get()
        .filter(function(line){return line !== ''});

        var data = {
            'display_name': $('#edit_display_name').val(),
            'img_urls': JSON.stringify(url_array),
            'interval': $('#interval').val()
        };
        runtime.notify('save', { state: 'start' });

        var handlerUrl = runtime.handlerUrl(element, 'save_carouselxblock');
        console.log(handlerUrl);
        console.log(data);

        $.post(handlerUrl, JSON.stringify(data)).done(function (response) {
            if (response.result === 'success') {
                runtime.notify('save', { state: 'end' });
            }
            else {
                runtime.notify('error', { msg: response.message });
            }
        });
    });
}