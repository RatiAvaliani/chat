const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class dashboard {
    io = null;
    sendToUserId = null;
    userId = null;

    constructor () {
        this.io = io('http://192.168.100.11', {query: `token=${$('.messaging').data('token')}`}); //'http://192.168.100.7:1000'
        this.selectUser();
        this.send();
        this.broadcast();
        this.onEnter();
        this.userSearchModal();
        this.search();
        this.getIndividualConcatList();
    }

    loadIndividualContactList (userInfo) {
        try {
            $('.chat-templates').find('.chat_contact_list').find('h5').text(userInfo.username);
            $('.chat-templates').find('.chat_contact_list').attr('data-user-id', userInfo.userId);

            $('.inbox_chat').append($('.chat-templates').find('.chat_contact_list').html());
        } catch (e) {
            // @TODO add server logs
        }
        
        
        //@TODO crate a template for contact list on the left
        // add groups template as well
        // loade the template to the left
    }

    getIndividualConcatList () {
        global.setLoaderGif('.inbox_people');
        $.post('/getIndividualContacts', {}, (info) => {
            $('.inbox_chat').html(''); 
            global.removeLoaderGif('.inbox_people');
            for (let userId in info.contactList) {
                this.loadIndividualContactList(info.contactList[userId]);
            } 
        });
    }

    addUser () {
        $('.chat_add_user').click((e) => {
            let userId = $(e.currentTarget).parent().parent().data('user-id');
            
            $.post('/addIndividualContact', {userId: userId}, (info) => {
                //@TODO mark user as added
                if (info.status === false) {
                    swal({
                        title: info.message,
                        icon: "warning"
                      });
                } else {
                    $(e.currentTarget).find('i').removeClass('fa-plus').addClass('fa-check-circle');
                    this.getIndividualConcatList();
                }
            });
        });
    }

    selectUser () {
        $('.chat_list').click((e) => {
            $('.chat_list').removeClass('active');
            $(e.currentTarget).addClass('active');
            $('.msg_history').html('');
            this.sendToUserId = $(e.currentTarget).data('user-id');
            this.selectUserHistory();
            this.showChat();
        });
        this.userId = $('.messaging').data('current-user-id');
    }

    loadUsers (info) {
        $('.chat-templates').find('.list-group-item').find('.chat_title').text(info.username);
        $('.chat-templates').find('.list-group-item').find('.chat_list').attr('data-user-id', info._id);
        $('.list-group').append($('.chat-templates').find('.list-group-item').html());
    }

    loadSearch (info) {
        global.removeLoaderGif('.list-group');
        $('.list-group').html('');
        for (let i = 0; i < info.length; i++) {
            this.loadUsers(info[i]);
        }
        this.addUser();
    }
    
    search () {
        $('.btn-search').click((e) => {
            let input = $('#search');
            let inputVal = input.val();
            
            global.setLoaderGif('.list-group');
            $.post('/searchUsers', {'username': inputVal, 'userId': this.userId}, (userList) => this.loadSearch(userList));
            input.val('');
        });
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

    userSearchModal () {
        $('.add-user').click(() => $('#search-usrs').modal('toggle'));
    }

    autoScroll () {
        $('html').scrollTop($('.msg_history').height());
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

        $('#search').on("keyup", (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                $('.btn-search').click();
            }
        });
    }

    selectUserHistory () {
        this.io.emit('getHistory', {
            "type" : "history", 
            "to" : this.sendToUserId,
            "from" : this.userId
        });

        this.io.on('userHistory', (info) => {
            $('.msg_history').html('');
            this.noHistory(info);
            this.loadHistory(info);
            this.autoScroll();
        });
    }

    loadMessages (info) {
        let time = new Date();
        if (info._id !== undefined) {
            time = new Date(parseInt(info._id.toString().substring(0,8), 16)* 1000);
        }
        
        $('.chat-templates').find(".time_date").text(`${time.getHours()}:${time.getMinutes()} | ${time.getDate()} ${monthNames[time.getMonth()]}`);
        
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
            this.io.emit('saveMessage', {
                "to" : this.sendToUserId,
                "from" : this.userId,
                "mess" : $('.write_msg').val()
            });
            $('.write_msg').val('');
        });
    }
}

$( document ).ready(() => (new dashboard())); 