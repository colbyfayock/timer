$(function() {

    function get_time_breakdown(timestamp) {

        if ( timestamp <= 0 ) return false;
        timestamp = timestamp / 1000;

        return {
            days: Math.floor( timestamp / 60 / 60 / 24 ),
            hours: Math.floor( ( timestamp / 60 / 60 ) % 24 ),
            minutes: Math.floor( ( timestamp / 60 ) % 60 ),
            seconds: Math.floor( timestamp % 60 )
        }

    }

    var Timer = function(timer) {

        var _this = this;

        _this.instance = timer instanceof $ ? timer : $(timer);

        _this.timer = false;

        _this.active = false;

        _this.settings = {
            time_end: _this.instance.data('time-end')
        }

        _this.start( _this.instance );

    }

    Timer.prototype.get_time_left = function() {

        var _this = this;
        
        // Needs local timezone support support
        
        return new Date(_this.settings.time_end).getTime() - new Date();

    }

    Timer.prototype.refresh_display = function() {

        var _this = this;

        if ( !_this.active ) {
            _this.instance.removeClass('timer-is-active').addClass('timer-is-expired');
            return;
        }

        _this.instance.removeClass('timer-is-expired').addClass('timer-is-active');

        for ( var key in _this.time ) {

            var $container = _this.instance.find('.timer-' + key),
                $label = _this.instance.find('.timer-label-' + key),
                time_split = Array.prototype.slice.call(_this.time[key].toString().split('')),
                time_split_len = time_split.length;

            if ( time_split_len === 0 ) continue;

            $container.html('');

            for ( var i = 0; i < time_split_len; i++ ) {

                var $digit = $('<span></span>');

                $digit.text(time_split[i]).attr('class', 'timer-digit-' + time_split[i])

                $container.append($digit);

            }

            $label.attr('class', 'timer-label-' + key.substring(0, key.length - 1) + ( _this.time[key] === 1 ? 's' : '' ) );

        }

        return _this;

    }

    Timer.prototype.update = function(time_left) {

        var _this = this;

        _this.time = get_time_breakdown(time_left);
        _this.active = _this.time ? true : false;

        if ( !_this.active ) _this.stop();
        
        _this.refresh_display();

        return _this;

    }

    Timer.prototype.start = function() {

        var _this = this;

        _this.update( _this.get_time_left() );

        _this.timer = setInterval(function() {

            _this.update( _this.get_time_left() );

        }, 1000);

        return _this;

    }

    Timer.prototype.stop = function() {

        var _this = this;

        clearInterval(_this.timer);

        return _this;

    }

    $.fn.timer = function(action) {
        
        var _this = this,
            _this_len = _this.length;

        for ( var i = 0; i < _this_len; i++ ) {
            if ( typeof action === 'object' || typeof action === 'undefined' ) {
                _this[i].timer = new Timer(_this[i])
            } else {
                console.log(_this[i].timer[action]());
            }
        }

        return _this;

    }

});