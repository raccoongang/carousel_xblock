function crouselXBlockInitEdit(runtime, element) {

    var saveHandlerUrl = runtime.handlerUrl(element, 'save_carouselxblock');
    var uploadImgHandlerUrl = runtime.handlerUrl(element, 'upload_img');

    $(element).find('.action-cancel').bind('click', function () {
        runtime.notify('cancel', {});
    });

    $(".sortable", element).sortable();
    $(".sortable", element).disableSelection();

    $('.delete_img', element).on('click', function() {
        console.log('delete_url');
        $(this).parent('li').remove();
    });

    $(element).find('#files').bind('change', function() {
        var form_data = new FormData();
        $.each($(element).find('#files'), function(i, obj) {
            $.each(obj.files,function(i,file){
                form_data.append('files', file);
            });
        });
        $.ajax({
            url: uploadImgHandlerUrl,
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: "POST",
            success: function(response){
                var response = $.parseJSON(response)
                var $imgList = $('.sortable.urls', element);
                $imgList.html('');
                for (url of response.img_urls){
                    $imgList.append(
                        '<li class="ui-state-default">' +
                        '<img class="preview" data-path="' + url + '" src="' + response.media_url + url + '">' +
                        '<button class="delete_img" data-path="' + url + '">×</button>' +
                        '</li>'
                    )
                }
            },
            error: function(err) {
              console.log(err);
            }
        });
    });

    $(element).find('.action-save').bind('click', function() {
        var form_data = new FormData();
        var display_name = $(element).find('#edit_display_name').val();
        var interval = $(element).find('#interval').val();
        form_data.append('display_name', display_name);
        $(element).find('.preview').each(function() {
            form_data.append('img_urls', $( this ).data('path'));
        })
        form_data.append('interval', interval);
        runtime.notify('save', { state: 'start' });
        $.ajax({
          url: saveHandlerUrl,
          dataType: 'text',
          cache: false,
          contentType: false,
          processData: false,
          data: form_data,
          type: "POST",
          success: function(){
            runtime.notify('save', {state: 'end'});
          },
          error: function(err) {
            console.log(err);
          }
        });
    });

}