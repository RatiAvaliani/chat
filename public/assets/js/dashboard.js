class dashboard {
    io = null;
    sendToUserId = null;
    userId = null;

    constructor () {
        this.io = io(); //'http://192.168.100.7:1000'
        this.selectUser();
        this.send();
        this.broadcast();
        this.onEnter(); 
    }

    selectUser () {
        $('.chat_list').click((e) => {
            this.sendToUserId = $(e.currentTarget).data('user-id');
            $('.chat_list').removeClass('active');
            $(e.currentTarget).addClass('active');
            $('.msg_history').html('');
            this.selectUserHistory();
            this.showChat();
        });
        this.userId = $('.messaging').data('current-user-id');
    }

    showChat () {
        $('.select-to-message').addClass('d-none');
        $('.mesgs').removeClass('d-none');
    }

    noHistory (info) {
        if (info.length <= 0) {
            $('.no_history').removeClass('d-none');
        } else {
            $('.no_history').addClass('d-none');
        } 
    }

    autoScroll () {
        $('.msg_history').scrollTop($('.msg_history').height()*10000);
    }

    broadcast () {
        this.io.on('broadcast', (data) => this.loadMessages(data));
    }

    onEnter () {
        $('.write_msg').on("keyup", (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                $('.msg_send_btn').click();
            }
        });
    }

    selectUserHistory () {
        this.io.emit('history', {
            "type" : "history",
            "to" : this.sendToUserId,
            "from" : this.userId
        });

        this.io.on('history', (info) => {
            $('.msg_history').html('');
            this.noHistory(info);
            this.loadHistory(info);
            this.autoScroll();
        });
    }

    loadMessages (info) {
        if (info.fromUserId !== this.userId) {
            $('.chat-templates').find(".incoming-user").find('.received_withd_msg > p').text(info.message);
            $('.msg_history').append($('.chat-templates').find(".incoming-user").html());
        } else {
            $('.chat-templates').find(".outgoing-user").find('.sent_msg > p').text(info.message);
            $('.msg_history').append($('.chat-templates').find(".outgoing-user").html());
        }
        this.autoScroll();
    }

    loadHistory (info) {
        for (let i = 0; i < info.length; i++) {
            this.loadMessages(info[i]);
        }
    }

    send () {
        $('.msg_send_btn').click(() => {
            this.io.emit('save', {
                "to" : this.sendToUserId,
                "from" : this.userId,
                "mess" : $('.write_msg').val()
            });
            $('.write_msg').val('');
        });
    }
}

(new dashboard());