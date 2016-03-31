// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
};

(function($) {

    var basicEditor = new Quill('.editor', {
        modules: {
            'multi-cursor': true,
            'toolbar': { container: '.editor-toolbar' },
            'link-tooltip': true
        },
        theme: 'snow',
        formats: ['bold', 'italic', 'color', 'font', 'size', 'align']
    });

    $('.get-screenshot').click(function() {
        html2canvas($('.editor'), {
            onrendered: function(canvas) {
                var dataURL = canvas.toDataURL();
                $('img.source')[0].src = dataURL;
                App.run();
            }
        });
    })
    $('.slabtext-button').click(function() {

        $(".ql-editor > div").slabText({
            // Don't slabtext the headers if the viewport is under 380px
            "viewportBreakpoint": 384
        });
        // $('.slabtextdone').html($('.slabtextdone').html().replace(/\\span> <span/g, '\\span><span'))
    })


    $('input[type=file]').on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event) {
        var file = this.files[0];

        if (window.FileReader) {
            reader = new FileReader();
            reader.onloadend = function(e) {
                $('.source').attr('src', e.target.result);
                App.run();
            };
            reader.readAsDataURL(file);
        }
        if (window.FormData) {
            formdata = new FormData();
            formdata.append("image", file);
        }
        if (formdata) {

        }
        files = event.target.files;
    }

    $('.print').click(function() {
        var base64 = $('#canvas')[0].toDataURL();
        var url = '' || localStorage.url
        var type = $('.print-selector-radio input[checked]').val();
        $.ajax({
            url: url + "/printer/"+type+"/print_raw",
            type: "POST",
            data: base64.split(',')[1],
            // processData: false,
            contentType: false,
            // async: false,
            complete: function(res) {
                $('.print.btn').text('Print').removeClass('orange');
            },
            beforeSend: function(res) {
                $('.print.btn').text('Send to printer').addClass('orange');
            }
        });
    })

    // Add segments to a slider
    $.fn.addSliderSegments = function(amount) {
        return this.each(function() {
            var segmentGap = 100 / (amount - 1) + "%",
                segment = "<div class='ui-slider-segment' style='margin-left: " + segmentGap + ";'></div>";
            $(this).prepend(segment.repeat(amount - 2));
        });
    };

    $(function() {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            var ww = ($(window).width() < window.screen.width) ? $(window).width() : window.screen.width; //get proper width
            var mw = 435; // min width of site
            var ratio = ww / mw; //calculate ratio
            if (ww < mw) { //smaller than minimum size
                $('#Viewport').attr('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=yes, width=' + ww);
            } else { //regular size
                $('#Viewport').attr('content', 'initial-scale=1.0, maximum-scale=2, minimum-scale=1.0, user-scalable=yes, width=' + ww);
            }
        }

        // Custom Selects
        $("select[name='huge']").selectpicker({ style: 'btn-huge btn-primary', menuStyle: 'dropdown-inverse' });
        $("select[name='large']").selectpicker({ style: 'btn-large btn-danger' });
        $("select[name='info']").selectpicker({ style: 'btn-info' });
        $("select[name='small']").selectpicker({ style: 'btn-small btn-warning' });

        // Tabs
        $(".nav-tabs a").on('click', function(e) {
            e.preventDefault();
            $(this).tab("show");
        })

        // Tooltips
        $("[data-toggle=tooltip]").tooltip("show");

        // Tags Input
        $(".tagsinput").tagsInput();

        // jQuery UI Sliders
        var $slider = $(".slider-brightness");
        if ($slider.length > 0) {
            $slider.slider({
                min: -100,
                max: 100,
                value: localStorage.brightness || 0,
                orientation: "horizontal",
                range: "min",
                change: function(event, ui) {
                    localStorage.brightness = ui.value;
                    App.brightness = ui.value;
                    App.run();
                }
            }).addSliderSegments($slider.slider("option").max);
        }
        // jQuery UI Sliders
        var $slider = $(".slider-contrast");
        if ($slider.length > 0) {
            $slider.slider({
                min: 1,
                max: 10,
                value: localStorage.contrast * 10 || 8,
                orientation: "horizontal",
                range: "min",
                change: function(event, ui) {
                    var value = ui.value / 10;
                    localStorage.contrast = value
                    App.contrast = value;
                    App.run();
                }
            }).addSliderSegments($slider.slider("option").max);
        }

        // Add style class name to a tooltips
        $(".tooltip").addClass(function() {
            if ($(this).prev().attr("data-tooltip-style")) {
                return "tooltip-" + $(this).prev().attr("data-tooltip-style");
            }
        });

        // Placeholders for input/textarea
        $("input, textarea").placeholder();

        // Make pagination demo work
        $(".pagination a").on('click', function() {
            $(this).parent().siblings("li").removeClass("active").end().addClass("active");
        });

        $(".btn-group a").on('click', function() {
            $(this).siblings().removeClass("active").end().addClass("active");
        });

        // Disable link clicks to prevent page scrolling
        $('a[href="#fakelink"]').on('click', function(e) {
            e.preventDefault();
        });

        // jQuery UI Spinner
        $.widget("ui.customspinner", $.ui.spinner, {
            _buttonHtml: function() { // Remove arrows on the buttons
                return "" +
                    "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
                    "<span class='ui-icon " + this.options.icons.up + "'></span>" +
                    "</a>" +
                    "<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
                    "<span class='ui-icon " + this.options.icons.down + "'></span>" +
                    "</a>";
            }
        });

        $('#spinner-01').customspinner({
            min: -99,
            max: 99
        }).on('focus', function() {
            $(this).closest('.ui-spinner').addClass('focus');
        }).on('blur', function() {
            $(this).closest('.ui-spinner').removeClass('focus');
        });


        // Focus state for append/prepend inputs
        $('.input-prepend, .input-append').on('focus', 'input', function() {
            $(this).closest('.control-group, form').addClass('focus');
        }).on('blur', 'input', function() {
            $(this).closest('.control-group, form').removeClass('focus');
        });

        // Table: Toggle all checkboxes
        $('.table .toggle-all').on('click', function() {
            var ch = $(this).find(':checkbox').prop('checked');
            $(this).closest('.table').find('tbody :checkbox').checkbox(!ch ? 'check' : 'uncheck');
        });

        // Table: Add class row selected
        $('.table tbody :checkbox').on('check uncheck toggle', function(e) {
            var $this = $(this),
                check = $this.prop('checked'),
                toggle = e.type == 'toggle',
                checkboxes = $('.table tbody :checkbox'),
                checkAll = checkboxes.length == checkboxes.filter(':checked').length

            $this.closest('tr')[check ? 'addClass' : 'removeClass']('selected-row');
            if (toggle) $this.closest('.table').find('.toggle-all :checkbox').checkbox(checkAll ? 'check' : 'uncheck');
        });

        // jQuery UI Datepicker
        $('#datepicker-01').datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: "d MM, yy",
            yearRange: '-1:+1'
        }).prev('.btn').on('click', function(e) {
            e && e.preventDefault();
            $('#datepicker-01').focus();
        });
        $.extend($.datepicker, {
            _checkOffset: function(inst, offset, isFixed) {
                return offset
            }
        });

        // Switch
        $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();

        // Stackable tables
        $(".table-striped").stacktable({ id: "rwd-table" });
    });
})(jQuery);
