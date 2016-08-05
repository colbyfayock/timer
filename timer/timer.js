$(function() {

    var Timer = function(timer) {

        var _this = this;

        _this.instance = timer instanceof $ ? timer : $(timer);

        _this.timer = false;

        _this.settings = {
            time_end: _this.instance.data('time-end')
        }

        _this.get_time_left = function() {
            // Needs local timezone support support
            return new Date(_this.settings.time_end).getTime() - new Date();
        }

        _this.get_time_breakdown = function(timestamp) {

            if ( timestamp <= 0 ) return false;
            timestamp = timestamp / 1000;

            return {
                days: Math.floor( timestamp / 60 / 60 / 24 ),
                hours: Math.floor( ( timestamp / 60 / 60 ) % 24 ),
                minutes: Math.floor( ( timestamp / 60 ) % 60 ),
                seconds: Math.floor( timestamp % 60 )
            }

        }

        _this.update_timer = function($timer, time_left) {

            var breakdown;

            if ( breakdown = _this.get_time_breakdown(time_left) ) {
                _this.instance.removeClass('timer-is-expired');
            } else {
                _this.instance.removeClass('timer-is-active').addClass('timer-is-expired');
                return;
            }

            for ( var key in breakdown ) {

                var $container = $timer.find('.timer-' + key),
                    $container_children,
                    time_split = breakdown[key].toString().split('');

                time_split = Array.prototype.slice.call(time_split);

                window.asdf = time_split;
                
                if ( !$container[0] ) continue;

                $container_children = $container.children();

                if ( time_split.length === 0 ) continue;
                if ( time_split.length === 1 ) time_split.unshift('0');

                $container_children.eq(0).text(time_split[0]).attr('class', 'timer-digit-' + time_split[0]);
                $container_children.eq(1).text(time_split[1]).attr('class', 'timer-digit-' + time_split[1]);

            }

            _this.instance.addClass('timer-is-active');

        }

        _this.start_timer = function() {

            _this.update_timer( _this.instance, _this.get_time_left() );

            _this.timer = setInterval(function() {

                _this.update_timer( _this.instance, _this.get_time_left() );

            }, 1000);

        }

        _this.start_timer( _this.instance );

    }

    $.fn.timer = function() {
        
        var _this = this,
            _this_len = _this.length;

        for ( var i = 0; i < _this_len; i++ ) {
            _this[i].timer = new Timer(_this[i])
        }

        return _this;

    }

});