/**
 *js is taken from https://github.com/mukulhase/WebWhatsapp-Wrapper/blob/master/webwhatsapi/js/wapi.js
 * A Python library which is worth checking out.
 * The new WAPI is made from https://github.com/Theblood/Wapi_NEW/blob/master/wapi.js
 */

/**
 * This script contains WAPI functions that need to be run in the context of the webpage
 */

/**
 * Auto discovery the webpack object references of instances that contains all functions used by the WAPI
 * functions and creates the Store object.
 */

if (!window.Store || !window.Store.Msg) {
    (function() {
        function getStore(modules) {
            let foundCount = 0;
            let neededObjects = [
                { id: 'Store', conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null },
                { id: 'MediaCollection', conditions: (module) => (module.default && module.default.prototype && (module.default.prototype.processFiles !== undefined || module.default.prototype.processAttachments !== undefined)) ? module.default : null },
                { id: 'MediaProcess', conditions: (module) => (module.BLOB) ? module : null },
                { id: 'Archive', conditions: (module) => (module.setArchive) ? module : null },
                { id: 'Block', conditions: (module) => (module.blockContact && module.unblockContact) ? module : null },
                { id: 'ChatUtil', conditions: (module) => (module.sendClear) ? module : null },
                { id: 'GroupInvite', conditions: (module) => (module.queryGroupInviteCode) ? module : null },
                { id: 'Wap', conditions: (module) => (module.createGroup) ? module : null },
                { id: 'ServiceWorker', conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
                { id: 'State', conditions: (module) => (module.STATE && module.STREAM) ? module : null },
                { id: '_Presence', conditions: (module) => (module.setPresenceAvailable && module.setPresenceUnavailable) ? module : null },
                { id: 'WapDelete', conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
                { id: 'Conn', conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
                { id: 'WapQuery', conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
                { id: 'CryptoLib', conditions: (module) => (module.decryptE2EMedia) ? module : null },
                { id: 'OpenChat', conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
                { id: 'UserConstructor', conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
                { id: 'SendTextMsgToChat', conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
                { id: 'ReadSeen', conditions: (module) => (module.sendSeen) ? module : null },
                { id: 'sendDelete', conditions: (module) => (module.sendDelete) ? module.sendDelete : null },
                { id: 'addAndSendMsgToChat', conditions: (module) => (module.addAndSendMsgToChat) ? module.addAndSendMsgToChat : null },
                { id: 'sendMsgToChat', conditions: (module) => (module.sendMsgToChat) ? module.sendMsgToChat : null },
                { id: 'Catalog', conditions: (module) => (module.Catalog) ? module.Catalog : null },
                { id: 'bp', conditions: (module) => (module.default && module.default.toString().includes('bp_unknown_version')) ? module.default : null },
                { id: 'MsgKey', conditions: (module) => (module.default && module.default.toString().includes('MsgKey error: obj is null/undefined')) ? module.default : null },
                { id: 'Parser', conditions: (module) => (module.convertToTextWithoutSpecialEmojis) ? module.default : null },
                { id: 'Builders', conditions: (module) => (module.TemplateMessage && module.HydratedFourRowTemplate) ? module : null },
                { id: 'Me', conditions: (module) => (module.PLATFORMS && module.Conn) ? module.default : null },
                { id: 'CallUtils', conditions: (module) => (module.sendCallEnd && module.parseCall) ? module : null },
                { id: 'Identity', conditions: (module) => (module.queryIdentity && module.updateIdentity) ? module : null },
                { id: 'MyStatus', conditions: (module) => (module.getStatus && module.setMyStatus) ? module : null },
                { id: 'ChatStates', conditions: (module) => (module.sendChatStatePaused && module.sendChatStateRecording && module.sendChatStateComposing) ? module : null },
                { id: 'GroupActions', conditions: (module) => (module.sendExitGroup && module.localExitGroup) ? module : null },
                { id: 'Features', conditions: (module) => (module.FEATURE_CHANGE_EVENT && module.features) ? module : null },
                { id: 'MessageUtils', conditions: (module) => (module.storeMessages && module.appendMessage) ? module : null },
                { id: 'WebMessageInfo', conditions: (module) => (module.WebMessageInfo && module.WebFeatures) ? module.WebMessageInfo : null },
                { id: 'createMessageKey', conditions: (module) => (module.createMessageKey && module.createDeviceSentMessage) ? module.createMessageKey : null },
                { id: 'Participants', conditions: (module) => (module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants) ? module : null },
                { id: 'WidFactory', conditions: (module) => (module.isWidlike && module.createWid && module.createWidFromWidLike) ? module : null },
                { id: 'Base', conditions: (module) => (module.setSubProtocol && module.binSend && module.actionNode) ? module : null },
                { id: 'Versions', conditions: (module) => (module.loadProtoVersions && module.default['15'] && module.default['16'] && module.default['17']) ? module : null },
                { id: 'Sticker', conditions: (module) => (module.default && module.default.Sticker) ? module.default.Sticker : null },
                { id: 'MediaUpload', conditions: (module) => (module.default && module.default.mediaUpload) ? module.default : null },
                { id: 'UploadUtils', conditions: (module) => (module.default && module.default.encryptAndUpload) ? module.default : null }
            ];
            for (let idx in modules) {
                if ((typeof modules[idx] === 'object') && (modules[idx] !== null)) {
                    let first = Object.values(modules[idx])[0];
                    if ((typeof first === 'object') && (first.exports)) {
                        for (let idx2 in modules[idx]) {
                            let module = modules(idx2);
                            // console.log('TCL: getStore -> module', module ? Object.getOwnPropertyNames(module.default || module).filter(item => typeof (module.default || module)[item] === 'function').length ? module.default || module : '':'')
                            if (!module) {
                                continue;
                            }
                            neededObjects.forEach((needObj) => {
                                if (!needObj.conditions || needObj.foundedModule)
                                    return;
                                let neededModule = needObj.conditions(module);
                                if (neededModule !== null) {
                                    foundCount++;
                                    needObj.foundedModule = neededModule;
                                }
                            });
                            if (foundCount == neededObjects.length) {
                                break;
                            }
                        }

                        let neededStore = neededObjects.find((needObj) => needObj.id === 'Store');
                        window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
                        neededObjects.splice(neededObjects.indexOf(neededStore), 1);
                        neededObjects.forEach((needObj) => {
                            if (needObj.foundedModule) {
                                window.Store[needObj.id] = needObj.foundedModule;
                            }
                        });
                        window.Store.sendMessage = function(e) {
                            return window.Store.SendTextMsgToChat(this, ...arguments);
                        }
                        if (window.Store.MediaCollection) window.Store.MediaCollection.prototype.processFiles = window.Store.MediaCollection.prototype.processFiles || window.Store.MediaCollection.prototype.processAttachments;
                        return window.Store;
                    }
                }
            }
        }
        const parasite = `parasite${Date.now()}`
            // webpackJsonp([], { [parasite]: (x, y, z) => getStore(z) }, [parasite]);
        if (typeof webpackJsonp === 'function') webpackJsonp([], {
            [parasite]: (x, y, z) => getStore(z)
        }, [parasite]);
        else webpackJsonp.push([
            [parasite], {
                [parasite]: (x, y, z) => getStore(z)
            },
            [
                [parasite]
            ]
        ]);

    })();
}

WAPI = {};
_WAPI = {};

_serializeRawObj = (obj) => {
    if (obj && obj.toJSON) {
        return obj.toJSON();
    }
    return {}
};


_serializeChatObj = (obj) => {
    if (obj == undefined) {
        return null;
    }
    // console.log(obj);
    return Object.assign(_serializeRawObj(obj), {
        kind: obj.kind,
        isGroup: obj.isGroup,
        formattedTitle: obj.formattedTitle,
        contact: obj['contact'] ? _serializeContactObj(obj['contact']) : null,
        groupMetadata: obj['groupMetadata'] ? _serializeRawObj(obj['groupMetadata']) : null,
        presence: obj['presence'] ? _serializeRawObj(obj['presence']) : null,
        msgs: obj['msgs'] ? obj['msgs'] : null
    });
};

_serializeContactObj = (obj) => {
    if (obj == undefined) {
        return null;
    }
    return Object.assign(_serializeRawObj(obj), {
        formattedName: obj.formattedName,
        isHighLevelVerified: obj.isHighLevelVerified,
        isMe: obj.isMe,
        isMyContact: obj.isMyContact,
        isPSA: obj.isPSA,
        isUser: obj.isUser,
        isVerified: obj.isVerified,
        isWAContact: obj.isWAContact,
        profilePicThumbObj: obj.profilePicThumb ? _serializeProfilePicThumb(obj.profilePicThumb) : {},
        statusMute: obj.statusMute,
        msgs: null
    });
};


_serializeMessageObj = (obj) => {
    if (obj == undefined) {
        return null;
    }
    const _chat = obj['chat'] ? _serializeChatObj(obj['chat']) : {};
    if (obj.quotedMsg) obj.quotedMsgObj();
    return Object.assign(_serializeRawObj(obj), {
        id: obj.id._serialized,
        from: obj.from._serialized,
        quotedParticipant: obj.quotedParticipant ? obj.quotedParticipant._serialized ? obj.quotedParticipant._serialized : undefined : undefined,
        author: obj.author ? obj.author._serialized ? obj.author._serialized : undefined : undefined,
        chatId: obj.chatId ? obj.chatId._serialized ? obj.chatId._serialized : undefined : undefined,
        to: obj.to ? obj.to._serialized ? obj.to._serialized : undefined : undefined,
        fromMe: obj.id.fromMe,
        sender: obj['senderObj'] ? _serializeContactObj(obj['senderObj']) : null,
        timestamp: obj['t'],
        content: obj['body'],
        isGroupMsg: obj.isGroupMsg,
        isLink: obj.isLink,
        isMMS: obj.isMMS,
        isMedia: obj.isMedia,
        isNotification: obj.isNotification,
        isPSA: obj.isPSA,
        type: obj.type,
        chat: _chat,
        isOnline: _chat.isOnline,
        lastSeen: _chat.lastSeen,
        chatId: obj.id.remote,
        quotedMsgObj: _serializeMessageObj(obj['_quotedMsgObj']),
        mediaData: _serializeRawObj(obj['mediaData']),
        reply: body => reply(_chat.id._serialized, body, obj)
    });
};

_serializeNumberStatusObj = (obj) => {
    if (obj == undefined) {
        return null;
    }

    return Object.assign({}, {
        id: obj.jid,
        status: obj.status,
        isBusiness: (obj.biz === true),
        canReceiveMessage: (obj.status === 200)
    });
};

_serializeProfilePicThumb = (obj) => {
    if (obj == undefined) {
        return null;
    }

    return Object.assign({}, {
        eurl: obj.eurl,
        id: obj.id,
        img: obj.img,
        imgFull: obj.imgFull,
        raw: obj.raw,
        tag: obj.tag
    });
}

getAllContacts = function() {
    return window.Store.Contact.map((contact) => _serializeContactObj(contact));
};

/**
 * Fetches all contact objects from store, filters them
 *
 * @returns {Array|*} List of contacts
 */
getMyContacts = function() {
    return window.Store.Contact.filter((contact) => contact.isMyContact === true).map((contact) => _serializeContactObj(contact));
};

/**
 * Fetches contact object from store by ID
 *
 * @param id ID of contact
 * @returns {T|*} Contact object
 */
getContact = function(id) {
    const found = window.Store.Contact.get(id);
    return _serializeContactObj(found);
};

syncContacts = function() {
    Store.Contact.sync()
    return true;
}

/**
 * Fetches all chat objects from store
 *
 * @returns {Array|*} List of chats
 */
getAllChats = function() {
    return window.Store.Chat.map((chat) => _serializeChatObj(chat));
};

haveNewMsg = function(chat) {
    return chat.unreadCount > 0;
};

getAllChatsWithNewMsg = function() {
    return window.Store.Chat.filter(haveNewMsg).map((chat) => _serializeChatObj(chat));
};

/**
 * Fetches all chat IDs from store
 *
 * @returns {Array|*} List of chat id's
 */
getAllChatIds = function() {
    return window.Store.Chat.map((chat) => chat.id._serialized || chat.id);
};

getAllNewMessages = async function() {
    return JSON.stringify(getAllChatsWithNewMsg().map(c => getChat(c.id._serialized)).map(c => c.msgs._models.filter(x => x.isNewMsg)) || [])
}

// nnoo longer determined by x.ack==-1
getAllUnreadMessages = async function() {
    return Store.Chat.models.filter(chat => chat.unreadCount && chat.unreadCount > 0).map(unreadChat => unreadChat.msgs.models.slice(-1 * unreadChat.unreadCount)).flat().map(_serializeMessageObj)
}

getIndicatedNewMessages = async function() {
    return JSON.stringify(Store.Chat.models.filter(chat => chat.unreadCount).map(chat => { return { id: chat.id, indicatedNewMessages: chat.msgs.models.slice(Math.max(chat.msgs.length - chat.unreadCount, 0)).filter(msg => !msg.id.fromMe) } }))
}

getSingleProperty = function(namespace, id, property) {
    if (Store[namespace] && Store[namespace].get(id) && Object.keys(Store[namespace].get(id)).find(x => x.includes(property))) return Store[namespace].get(id)[property];
    return 404
}

getAllChatsWithMessages = async function(onlyNew) {
    let x = [];
    if (onlyNew) { x.push(getAllChatsWithNewMsg().map(c => getChat(c.id._serialized))); } else {
        x.push(getAllChatIds().map((c) => getChat(c)));
    }
    const result = (await Promise.all(x)).flatMap(x => x);
    return JSON.stringify(result);
}


/**
 * Sets the chat state
 * 
 * @param {0|1|2} chatState The state you want to set for the chat. Can be TYPING (1), RECRDING (2) or PAUSED (3);
 * returns {boolean}
 */
sendChatstate = async function(state, chatId) {
    switch (state) {
        case 0:
            await window.Store.ChatStates.sendChatStateComposing(chatId);
            break;
        case 1:
            await window.Store.ChatStates.sendChatStateRecording(chatId);
            break;
        case 2:
            await window.Store.ChatStates.sendChatStatePaused(chatId);
            break;
        default:
            return false
    }
    return true;
};

/**
 * Fetches chat object from store by ID
 *
 * @param id ID of chat
 * @returns {T|*} Chat object
 */
getChat = function(id) {
    if (!id) return false;
    id = typeof id == "string" ? id : id._serialized;
    const found = window.Store.Chat.get(id);
    if (found) found.sendMessage = (found.sendMessage) ? found.sendMessage : function() { return window.Store.sendMessage.apply(this, arguments); };
    return found;
}

/**
 * Get your status
 * @param {string} to '000000000000@c.us'
 * returns: {string,string} and string -"Hi, I am using WA"
 */
getStatus = async(id) => {
    return await Store.MyStatus.getStatus(id)
}

getChatByName = function(name) {
    return window.Store.Chat.find((chat) => chat.name === name);
};

sendImageFromDatabasePicBot = function(picId, chatId, caption) {
    var chatDatabase = getChatByName('DATABASEPICBOT');
    var msgWithImg = chatDatabase.msgs.find((msg) => msg.caption == picId);

    if (msgWithImg === undefined) {
        return false;
    }
    var chatSend = getChat(chatId);
    if (chatSend === undefined) {
        return false;
    }
    const oldCaption = msgWithImg.caption;

    msgWithImg.id.id = getNewId();
    msgWithImg.id.remote = chatId;
    msgWithImg.t = Math.ceil(new Date().getTime() / 1000);
    msgWithImg.to = chatId;

    if (caption !== undefined && caption !== '') {
        msgWithImg.caption = caption;
    } else {
        msgWithImg.caption = '';
    }

    msgWithImg.collection.send(msgWithImg).then(function(e) {
        msgWithImg.caption = oldCaption;
    });

    return true;
};

getGeneratedUserAgent = function(useragent) {
    if (!useragent.includes('WhatsApp')) return 'WhatsApp/0.4.315 ' + useragent;
    return useragent.replace(useragent.match(/WhatsApp\/([.\d])*/g)[0].match(/[.\d]*/g).find(x => x), window.Debug.VERSION)
}

getWAVersion = function() {
    return window.Debug.VERSION;
}

/**
 * Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
 * @param chatId 
 * @param url string A link, for example for youtube. e.g https://www.youtube.com/watch?v=61O-Galzc5M
 * @param text string Custom text as body of the message, this needs to include the link or it will be appended after the link.
 */
sendLinkWithAutoPreview = async function(chatId, url, text) {
    var chatSend = getChat(chatId);
    if (chatSend === undefined) {
        return false;
    }
    const linkPreview = await Store.WapQuery.queryLinkPreview(url);
    return (await chatSend.sendMessage(text.includes(url) ? text : `${url}\n${text}`, { linkPreview })) == 'success'
}

sendMessageWithThumb = function(thumb, url, title, description, text, chatId) {
    var chatSend = getChat(chatId);
    if (chatSend === undefined) {
        return false;
    }
    var linkPreview = {
        canonicalUrl: url,
        description: description,
        matchedText: url,
        title: title,
        thumbnail: thumb // Thumbnail max size allowed: 200x200
    };
    chatSend.sendMessage(text.includes(url) ? text : `${url}\n${text}`, { linkPreview: linkPreview, mentionedJidList: [], quotedMsg: null, quotedMsgAdminGroupJid: null });
    return true;
};


getNewId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

getChatById = function(id) {
    let found = getChat(id);
    if (found) {
        found = _serializeChatObj(found);
    } else {
        found = false;
    }
    return found;
};


/**
 * I return all unread messages from an asked chat and mark them as read.
 *
 * :param id: chat id
 * :type  id: string
 *
 * :param includeMe: indicates if user messages have to be included
 * :type  includeMe: boolean
 *
 * :param includeNotifications: indicates if notifications have to be included
 * :type  includeNotifications: boolean
 *
 * :returns: list of unread messages from asked chat
 * :rtype: object
 */
getUnreadMessagesInChat = function(id, includeMe, includeNotifications) {
    // get chat and its messages
    let chat = getChat(id);
    let messages = chat.msgs._models;

    // initialize result list
    let output = [];

    // look for unread messages, newest is at the end of array
    for (let i = messages.length - 1; i >= 0; i--) {
        // system message: skip it
        if (i === "remove") {
            continue;
        }

        // get message
        let messageObj = messages[i];

        // found a read message: stop looking for others
        if (typeof(messageObj.isNewMsg) !== "boolean" || messageObj.isNewMsg === false) {
            continue;
        } else {
            messageObj.isNewMsg = false;
            // process it
            let message = processMessageObj(messageObj,
                includeMe,
                includeNotifications);

            // save processed message on result list
            if (message)
                output.push(message);
        }
    }
    // return result list
    return output;
};


/**
 * Load more messages in chat object from server. Use this in a while loop
 *
 * @param id ID of chat
 * @returns None
 */
loadEarlierMessages = async function(id) {
    const chat = getChat(id);
    if (chat) {
        const someEarlierMessages = await chat.loadEarlierMsgs();
        if (someEarlierMessages) return someEarlierMessages.map(_serializeMessageObj);
    }
    return false;
};

/**
 * Load more messages in chat object from store by ID
 *
 * @param id ID of chat
 * @returns None
 */
loadAllEarlierMessages = async function(id) {
    const found = getChat(id);
    while (!found.msgs.msgLoadState.noEarlierMsgs) {
        console.log('loading more messages')
        await found.loadEarlierMsgs();
    }
    return true
};

asyncLoadAllEarlierMessages = async function(id) {
    return await loadAllEarlierMessages(id);
};

areAllMessagesLoaded = function(id) {
    const found = getChat(id);
    if (!found.msgs.msgLoadState.noEarlierMsgs) {
        return false
    }
    return true
};

/**
 * Load more messages in chat object from store by ID till a particular date
 *
 * @param id ID of chat
 * @param lastMessage UTC timestamp of last message to be loaded
 * @returns None
 */

loadEarlierMessagesTillDate = async function(id, lastMessage) {
    const found = getChat(id);
    x = async function() {
        if (found.msgs.models[0].t > lastMessage && !found.msgs.msgLoadState.noEarlierMsgs) {
            return await found.loadEarlierMsgs().then(x);
        } else {
            return true
        }
    };
    return await x();
};


/**
 * Returns an object with all of your host device details
 */
getMe = () => Store.Me.me.user;

isLoggedIn = function() {
    // Contact always exists when logged in
    const isLogged = window.Store.Contact && window.Store.Contact.checksum !== undefined;
    return isLogged;
};

isConnected = function() {
    // Phone Disconnected icon appears when phone is disconnected from the tnternet
    const isConnected = document.querySelector('*[data-icon="alert-phone"]') !== null ? false : true;
    return isConnected;
};

//I dont think this will work for group chats.
isChatOnline = async function(id) {
    return Store.Chat.get(id) ? await Store.Chat.get(id).presence.subscribe().then(_ => Store.Chat.get(id).presence.attributes.isOnline) : false;
}

processMessageObj = function(messageObj, includeMe, includeNotifications) {
    if (messageObj.isNotification) {
        if (includeNotifications)
            return_serializeMessageObj(messageObj);
        else
            return;
        // System message
        // (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
    } else if (messageObj.id.fromMe === false || includeMe) {
        return_serializeMessageObj(messageObj);
    }
    return;
};

getAllMessagesInChat = function(id, includeMe, includeNotifications) {
    const chat = getChat(id);
    let output = [];
    const messages = chat.msgs._models;

    for (const i in messages) {
        if (i === "remove") {
            continue;
        }
        const messageObj = messages[i];

        let message = processMessageObj(messageObj, includeMe, includeNotifications)
        if (message)
            output.push(message);
    }
    returnquickClean(output);
};

loadAndGetAllMessagesInChat = function(id, includeMe, includeNotifications) {
    returnloadAllEarlierMessages(id).then(_ => {
        const chat = getChat(id);
        let output = [];
        const messages = chat.msgs._models;

        for (const i in messages) {
            if (i === "remove") {
                continue;
            }
            const messageObj = messages[i];

            let message = processMessageObj(messageObj, includeMe, includeNotifications)
            if (message)
                output.push(message);
        }
        return output;
    })
};

getAllMessageIdsInChat = function(id, includeMe, includeNotifications) {
    const chat = getChat(id);
    let output = [];
    const messages = chat.msgs._models;

    for (const i in messages) {
        if ((i === "remove") ||
            (!includeMe && messages[i].isMe) ||
            (!includeNotifications && messages[i].isNotification)) {
            continue;
        }
        output.push(messages[i].id._serialized);
    }
    return output;
};

getMessageById = function(id) {
    let result = false;
    try {
        let msg = window.Store.Msg.get(id);
        if (msg) {
            result = processMessageObj(msg, true, true);
        }
    } catch (err) {}
    return result;
};

sendMessageWithMentions = async function(ch, body) {
    var chat = ch.id ? ch : Store.Chat.get(ch);
    var chatId = chat.id._serialized;
    var msgIveSent = chat.msgs.filter(msg => msg.__x_isSentByMe)[0];
    if (!msgIveSent) return chat.sendMessage(body);
    var tempMsg = Object.create(msgIveSent);
    var newId = getNewMessageId(chatId);
    var mentionedJidList = body.match(/@(\d*)/g).filter(x => x.length > 5).map(x => Store.Contact.get(x.replace("@", "") + "@c.us") ? new Store.WidFactory.createUserWid(x.replace("@", "")) : '') || undefined;
    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: new Store.WidFactory.createWid(chatId),
        isNewMsg: !0,
        type: "chat",
        body,
        quotedMsg: null,
        mentionedJidList
    };
    Object.assign(tempMsg, extend);
    await Store.addAndSendMsgToChat(chat, tempMsg)
    return newId._serialized;
}

sendMessageReturnId = async function(ch, body) {
    var chat = ch.id ? ch : Store.Chat.get(ch);
    var chatId = chat.id._serialized;
    var msgIveSent = chat.msgs.filter(msg => msg.__x_isSentByMe)[0];
    if (!msgIveSent) return chat.sendMessage(body);
    var tempMsg = Object.create(msgIveSent);
    var newId = getNewMessageId(chatId);
    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: new Store.WidFactory.createWid(chatId),
        isNewMsg: !0,
        type: "chat",
        body,
        quotedMsg: null
    };
    Object.assign(tempMsg, extend);
    await Store.addAndSendMsgToChat(chat, tempMsg)
    return newId._serialized;
}


sendMessage = async function(id, message) {
    if (id === 'status@broadcast') return false;
    let chat = getChat(id);
    if (!chat && !id.includes('g')) {
        var contact = getContact(id)
        if (!contact) return false;
        await Store.Chat.find(contact.id)
        chat = getChat(id);
    }
    if (chat !== undefined) {
        // returnsendMessageReturnId(chat,message).then(id=>{return id})
        return await chat.sendMessage(message).then(_ => chat.lastReceivedKey._serialized);
    }
    return false;
};

sendMessage2 = function(id, message) {
    var chat = getChat(id);
    if (chat !== undefined) {
        try {
            chat.sendMessage(message);
            return true;
        } catch (error) {
            return false;
        }
    }
    return false;
};

sendSeen = async function(id) {
    if (!id) return false;
    var chat = getChat(id);
    if (chat !== undefined) {
        await Store.ReadSeen.sendSeen(chat, false);
        return true;
    }
    return false;
};

markAsUnread = async function(id) {
    var chat = getChat(id);
    if (chat !== undefined) {
        await Store.ReadSeen.markUnread(chat, true);
        return true;
    }
    return false;
};

function isChatMessage(message) {
    if (message.isSentByMe) {
        return false;
    }
    if (message.isNotification) {
        return false;
    }
    if (!message.isUserCreatedType) {
        return false;
    }
    return true;
}

setPresence = function(available) {
    if (available) Store._Presence.setPresenceAvailable();
    else Store._Presence.setPresenceUnavailable();
}

getUnreadMessages = function(includeMe, includeNotifications, use_unread_count) {
    const chats = window.Store.Chat.models;
    let output = [];

    for (let chat in chats) {
        if (isNaN(chat)) {
            continue;
        }

        let messageGroupObj = chats[chat];
        let messageGroup = _serializeChatObj(messageGroupObj);

        messageGroup.messages = [];

        const messages = messageGroupObj.msgs._models;
        for (let i = messages.length - 1; i >= 0; i--) {
            let messageObj = messages[i];
            if (typeof(messageObj.isNewMsg) != "boolean" || messageObj.isNewMsg === false) {
                continue;
            } else {
                messageObj.isNewMsg = false;
                let message = processMessageObj(messageObj, includeMe, includeNotifications);
                if (message) {
                    messageGroup.messages.push(message);
                }
            }
        }

        if (messageGroup.messages.length > 0) {
            output.push(messageGroup);
        } else { // no messages with isNewMsg true
            if (use_unread_count) {
                let n = messageGroupObj.unreadCount; // will use unreadCount attribute to fetch last n messages from sender
                for (let i = messages.length - 1; i >= 0; i--) {
                    let messageObj = messages[i];
                    if (n > 0) {
                        if (!messageObj.isSentByMe) {
                            let message = processMessageObj(messageObj, includeMe, includeNotifications);
                            messageGroup.messages.unshift(message);
                            n -= 1;
                        }
                    } else if (n === -1) { // chat was marked as unread so will fetch last message as unread
                        if (!messageObj.isSentByMe) {
                            let message = processMessageObj(messageObj, includeMe, includeNotifications);
                            messageGroup.messages.unshift(message);
                            break;
                        }
                    } else { // unreadCount = 0
                        break;
                    }
                }
                if (messageGroup.messages.length > 0) {
                    messageGroupObj.unreadCount = 0; // reset unread counter
                    output.push(messageGroup);
                }
            }
        }
    }
    return output;
};


getProfilePicFromServer = function(id) {
    return Store.WapQuery.profilePicFind(id).then(x => x.eurl);
}

getProfilePicSmallFromId = async function(id) {
    return await window.Store.ProfilePicThumb.find(id).then(async d => {
        if (d.img !== undefined) {
            return await downloadFileWithCredentials(d.img);
        } else {
            return false
        }
    }, function(e) {
        return false
    })
};

getProfilePicFromId = async function(id) {
    return await window.Store.ProfilePicThumb.find(id).then(async d => {
        if (d.imgFull !== undefined) {
            return await downloadFileWithCredentials(d.imgFull);
        } else {
            return false
        }
    }, function(e) {
        return false
    })
};

downloadFileWithCredentials = async function(url) {
    if (!axios || !url) return false;
    const ab = (await axios.get(url, { responseType: 'arraybuffer' })).data
    return btoa(new Uint8Array(ab).reduce((data, byte) => data + String.fromCharCode(byte), ''));
};

downloadFile = async function(url) {
    return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let reader = new FileReader();
                    reader.readAsDataURL(xhr.response);
                    reader.onload = function(e) {
                        resolve(reader.result.substr(reader.result.indexOf(',') + 1))
                    };
                } else {
                    console.error(xhr.statusText);
                }
            } else {
                console.log(err);
                resolve(false);
            }
        };

        xhr.open("GET", url, true);
        xhr.responseType = 'blob';
        xhr.send(null);
    })
};

getBatteryLevel = function() {
    return Store.Conn.battery;
};

getIsPlugged = function() {
    return Store.Conn.plugged;
};

deleteConversation = async function(chatId) {
    let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
    let conversation = getChat(userId);
    if (!conversation) {
        return false;
    }
    return await window.Store.sendDelete(conversation, false).then(() => {
        return true;
    }).catch(() => {
        return false;
    });
};

smartDeleteMessages = async function(chatId, messageArray, onlyLocal) {
    var userId = new Store.WidFactory.createWid(chatId);
    let conversation = getChat(userId);
    if (!conversation) return false;

    if (!Array.isArray(messageArray)) {
        messageArray = [messageArray];
    }

    let messagesToDelete = messageArray.map(msgId => (typeof msgId == 'string') ? window.Store.Msg.get(msgId) : msgId).filter(x => x);
    if (messagesToDelete.length == 0) return true;
    let jobs = onlyLocal ? [conversation.sendDeleteMsgs(messagesToDelete, conversation)] : [
        conversation.sendRevokeMsgs(messagesToDelete.filter(msg => msg.isSentByMe), conversation),
        conversation.sendDeleteMsgs(messagesToDelete.filter(msg => !msg.isSentByMe), conversation)
    ]
    return Promise.all(jobs).then(_ => true)
};

deleteMessage = async function(chatId, messageArray, revoke = false) {
    let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
    let conversation = getChat(userId);

    if (!conversation) return false;

    if (!Array.isArray(messageArray)) {
        messageArray = [messageArray];
    }

    let messagesToDelete = messageArray.map(msgId => window.Store.Msg.get(msgId));

    if (revoke) {
        conversation.sendRevokeMsgs(messagesToDelete, conversation);
    } else {
        conversation.sendDeleteMsgs(messagesToDelete, conversation);
    }

    return true;
};

clearChat = async function(id) {
    return await Store.ChatUtil.sendClear(Store.Chat.get(id), true);
}

/**
 * @param id The id of the conversation
 * @param archive boolean true => archive, false => unarchive
 * @return boolean true: worked, false: didnt work (probably already in desired state)
 */
archiveChat = async function(id, archive) {
    return await Store.Archive.setArchive(Store.Chat.get(id), archive).then(_ => true).catch(_ => false)
}

/**
 * Extracts vcards from a message
 * @param id string id of the message to extract the vcards from
 * @returns [vcard] 
 * ```
 * [
 * {
 * displayName:"Contact name",
 * vcard: "loong vcard string"
 * }
 * ]
 * ``` or false if no valid vcards found
 */
getVCards = function(id) {
    var msg = Store.Msg.get(id);
    if (msg) {
        if (msg.type == 'vcard') {
            return [{
                displayName: msg.subtype,
                vcard: msg.body
            }]
        } else if (msg.type == 'multi_vcard') {
            return msg.vcardList
        } else return false;
    } else {
        return false
    }
}

checkNumberStatus = async function(id) {
    try {
        const result = await window.Store.WapQuery.queryExist(id);
        if (result.jid === undefined) throw 404;
        const data = _serializeNumberStatusObj(result);
        if (data.status == 200) data.numberExists = true
        return data;
    } catch (e) {
        return _serializeNumberStatusObj({
            status: e,
            jid: id
        });
    }
};

/**
 * New messages observable functions.
 */
_newMessagesQueue = [];
_newMessagesBuffer = (sessionStorage.getItem('saved_msgs') != null) ? JSON.parse(sessionStorage.getItem('saved_msgs')) : [];
_newMessagesDebouncer = null;
_newMessagesCallbacks = [];

window.Store.Msg.off('add');
sessionStorage.removeItem('saved_msgs');

_newMessagesListener = window.Store.Msg.on('add', (newMessage) => {
    if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe && !newMessage.isStatusV3) {
        let message = processMessageObj(newMessage, false, false);
        if (message) {
            _newMessagesQueue.push(message);
            _newMessagesBuffer.push(message);
        }

        // Starts debouncer time to don't call a callback for each message if more than one message arrives
        // in the same second
        if (!_newMessagesDebouncer && _newMessagesQueue.length > 0) {
            _newMessagesDebouncer = setTimeout(() => {
                let queuedMessages = _newMessagesQueue;

                _newMessagesDebouncer = null;
                _newMessagesQueue = [];

                let removeCallbacks = [];

                _newMessagesCallbacks.forEach(function(callbackObj) {
                    if (callbackObj.callback !== undefined) {
                        callbackObj.callback(queuedMessages);
                    }
                    if (callbackObj.rmAfterUse === true) {
                        removeCallbacks.push(callbackObj);
                    }
                });

                // Remove removable callbacks.
                removeCallbacks.forEach(function(rmCallbackObj) {
                    let callbackIndex = _newMessagesCallbacks.indexOf(rmCallbackObj);
                    _newMessagesCallbacks.splice(callbackIndex, 1);
                });
            }, 1000);
        }
    }
});



_unloadInform = (event) => {
    // Save in the buffer the ungot unreaded messages
    _newMessagesBuffer.forEach((message) => {
        Object.keys(message).forEach(key => message[key] === undefined ? delete message[key] : '');
    });
    sessionStorage.setItem("saved_msgs", JSON.stringify(_newMessagesBuffer));

    // Inform callbacks that the page will be reloaded.
    _newMessagesCallbacks.forEach(function(callbackObj) {
        if (callbackObj.callback !== undefined) {
            callbackObj.callback({ status: -1, message: 'page will be reloaded, wait and register callback again.' });
        }
    });
};

window.addEventListener("unload", _unloadInform, false);
window.addEventListener("beforeunload", _unloadInform, false);
window.addEventListener("pageunload", _unloadInform, false);

/**
 * Registers a callback to be called when a new message arrives the
 * @param rmCallbackAfterUse - Boolean - Specify if the callback need to be executed only once
 * @param callback - function - Callback function to be called when a new message arrives.
 * @returns {boolean}
 */
waitNewMessages = function(rmCallbackAfterUse = true, callback) {
    _newMessagesCallbacks.push({ callback, rmAfterUse: rmCallbackAfterUse });
    return true;
};


addAllNewMessagesListener = callback => window.Store.Msg.on('add', (newMessage) => {
    if (newMessage && newMessage.isNewMsg) {
        if (!newMessage.clientUrl && (newMessage.mediaKeyTimestamp || newMessage.filehash)) {
            const cb = (msg) => {
                if (msg.id._serialized === newMessage.id._serialized && msg.clientUrl) {
                    callback(processMessageObj(msg, true, false));
                    Store.Msg.off('change:isUnsentMedia', cb);
                }
            };
            Store.Msg.on('change:isUnsentMedia', cb);
        } else {
            let message = processMessageObj(newMessage, true, false);
            if (message) {
                callback(message)
            }
        }
    }
});

/**
 * Registers a callback to be called when a the acknowledgement state of the phone connection.
 * @param callback - function - Callback function to be called when the device state changes. this returns 'CONNECTED' or 'TIMEOUT'
 * @returns {boolean}
 */
onStateChanged = function(callback) {
    window.Store.State.default.on('change:state', callback)
    return true;
}

/**
 * Registers a callback to be called when your phone receives a new call request.
 * @param callback - function - Callback function to be called upon a new call. returns a call object.
 * @returns {boolean}
 */
onIncomingCall = function(callback) {
    window.Store.Call.on('add', callback);
    return true;
}

/**
 * @param label: either the id or the name of the label. id will be something simple like anhy nnumber from 1-10, name is the label of the label if that makes sense.
 * @param objectId The Chat, message or contact id to which you want to add a label
 * @param type The type of the action. It can be either "add" or "remove"
 * @returns boolean true if it worked otherwise false
 */
addOrRemoveLabels = async function(label, objectId, type) {
    var { id } = Store.Label.models.find(x => x.id == label || x.name == label)
    var to = Store.Chat.get(objectId) || Store.Msg.get(objectId) || Store.Contact.get(objectId);
    if (!id || !to) return false;
    const { status } = await Store.Label.addOrRemoveLabels([{ id, type }], [to]);
    return status === 200;
}

/**
 * Registers a callback to be called when a the acknowledgement state of a message changes.
 * @param callback - function - Callback function to be called when a message acknowledgement changes.
 * @returns {boolean}
 */
waitNewAcknowledgements = function(callback) {
    Store.Msg.on("change:ack", callback);
    return true;
}

//returns an array of liveLocationChangeObjects
forceUpdateLiveLocation = async function(chatId) {
    if (!Store.LiveLocation.get(chatId)) return false;
    returnquickClean(await Store.LiveLocation.update(chatId)).participants.map(l => {
        return {
            ...l,
            msgId: l.msg.id._serialized
        }
    });
}

onLiveLocation = function(chatId, callback) {
    var lLChat = Store.LiveLocation.get(chatId);
    if (lLChat) {
        var validLocs = lLChat.participants.validLocations();
        validLocs.map(x => x.on('change:lastUpdated', (x, y, z) => {
            const { id, lat, lng, accuracy, degrees, speed, lastUpdated } = x;
            const l = {
                id: id.toString(),
                lat,
                lng,
                accuracy,
                degrees,
                speed,
                lastUpdated
            };
            callback(l);
        }));
        return true;
    } else {
        return false;
    }
}

onBattery = function(callback) {
    window.Store.Conn.on('change:battery', ({ battery }) => callback(battery));
    return true;
}

onPlugged = function(callback) {
    window.Store.Conn.on('change:plugged', ({ plugged }) => callback(plugged));
    return true;
}

/**
 * Reads buffered new messages.
 * @returns {Array}
 */
getBufferedNewMessages = function() {
    let bufferedMessages = _newMessagesBuffer;
    _newMessagesBuffer = [];
    return bufferedMessages;
};
/** End new messages observable functions **/


sendImage = async function(imgBase64, chatid, filename, caption, quotedMsg, waitForKey, ptt) {
    if (!chatid.includes('@g') && !chatid.includes('@c')) return false;
    let extras = {};
    if (quotedMsg) {
        if (typeof quotedMsg !== "object") quotedMsg = Store.Msg.get(quotedMsg);
        extras = {
            quotedMsg,
            quotedParticipant: quotedMsg.author || quotedMsg.from,
            quotedStanzaID: quotedMsg.id.id
        };
    }
    return await Store.Chat.find(chatid).then(async(chat) => {
        var mediaBlob = base64ImageToFile(imgBase64, filename);
        return await procFiles(chat, mediaBlob).then(async mc => {
            var media = mc.models[0];
            if (ptt) media.mediaPrep._mediaData.type = 'ptt';
            await media.sendToChat(chat, { caption, ...extras });
            return waitForKey ? await new Promise(async(resolve, reject) => {
                const cb = msg => {
                    if (media.attributes.file.size === msg.size) resolve(msg.id._serialized);
                    Store.Msg.off('change:clientUrl', cb);
                };
                Store.Msg.on('change:clientUrl', cb);
            }) : true
        });
    });
}

/**
 * This function sts the profile name of the number.
 * @param newName - string the new name to set as profile name
 */
setMyName = async function(newName) {
    if (!Store.Versions.default[11].BinaryProtocol) Store.Versions.default[11].BinaryProtocol = new Store.bp(11);
    return await Store.Versions.default[11].setPushname(newName);
}

/** Change the icon for the group chat
 * @param groupId 123123123123_1312313123@g.us The id of the group
 * @param imgData 'data:image/jpeg;base64,...` The base 64 data uri
 * @returns boolean true if it was set, false if it didn't work. It usually doesn't work if the image file is too big.
 */
setGroupIcon = async function(groupId, imgData) {
    const { status } = await Store.WapQuery.sendSetPicture(groupId, imgData, imgData);
    return status == 200;
}

/**
 * Update your status
 *   @param newStatus string new Status
 */
setMyStatus = function(newStatus) {
    return Store.MyStatus.setMyStatus(newStatus)
}

sendVideoAsGif = async function(imgBase64, chatid, filename, caption, quotedMsg) {
    let extras = {};
    if (quotedMsg) {
        if (typeof quotedMsg !== "object") quotedMsg = Store.Msg.get(quotedMsg);
        extras = {
            quotedMsg,
            quotedParticipant: quotedMsg.author || quotedMsg.from,
            quotedStanzaID: quotedMsg.id.id
        };
    }
    // create new chat
    return await Store.Chat.find(chatid).then(async(chat) => {
        var mediaBlob = base64ImageToFile(imgBase64, filename);
        var mc = new Store.MediaCollection(chat);
        return await procFiles(chat, mediaBlob).then(async mc => {
            var media = mc.models[0];
            media.mediaPrep._mediaData.isGif = true;
            media.mediaPrep._mediaData.gifAttribution = 1;
            await media.mediaPrep.sendToChat(chat, { caption, ...extras });
            return chat.lastReceivedKey._serialized;
        });
    });
}

refreshBusinessProfileProducts = async function() {
    await Promise.all(Store.BusinessProfile.models.map(async x => {
        try {
            await Store.Catalog.findCarouselCatalog(x.id._serialized)
        } catch (error) {}
    }));
    return true;
}

/**
 * Find any product listings of the given number. Use this to query a catalog
 *
 * @param id id of buseinss profile (i.e the number with @c.us)
 * @returns None
 */
getBusinessProfilesProducts = async function(id) {
    awaitrefreshBusinessProfileProducts();
    if (!Store.Catalog.get(id)) await Store.Catalog.findCarouselCatalog(id)
    const catalog = Store.Catalog.get(id);
    if (catalog.productCollection && catalog.productCollection._models.length)
        return catalog.productCollection._models;
};


procFiles = async function(chat, blobs) {
        if (!Array.isArray(blobs)) {
            blobs = [blobs];
        }
        var mc = new Store.MediaCollection(chat);
        await mc.processFiles((Debug.VERSION === '0.4.613') ? blobs : blobs.map(blob => { return { file: blob } }), chat, 1);
        return mc
    }
    /**
     * Sends product with image to chat
     * @param imgBase64 Base64 image data
     * @param chatid string the id of the chat that you want to send this product to
     * @param caption string the caption you want to add to this message
     * @param bizNumber string the @c.us number of the business account from which you want to grab the product
     * @param productId string the id of the product within the main catalog of the aforementioned business
     * @returns 
     */
sendImageWithProduct = async function(imgBase64, chatid, caption, bizNumber, productId) {
    awaitrefreshBusinessProfileProducts();
    return await Store.Catalog.findCarouselCatalog(bizNumber).then(async cat => {
        if (cat && cat[0]) {
            const product = cat[0].productCollection.get(productId);
            const temp = {
                productMsgOptions: {
                    businessOwnerJid: product.catalogWid.toString({
                        legacy: !0
                    }),
                    productId: product.id.toString(),
                    url: product.url,
                    productImageCount: product.productImageCollection.length,
                    title: product.name,
                    description: product.description,
                    currencyCode: product.currency,
                    priceAmount1000: product.priceAmount1000,
                    type: "product"
                },
                caption
            }

            // var idUser = new Store.WidFactory.createWid(chatid);

            return Store.Chat.find(chatid).then(async(chat) => {
                var mediaBlob = base64ImageToFile(imgBase64, "filename.jpg");
                // var mc = new Store.MediaCollection(chat);
                // mc.processFiles([mediaBlob], chat, 1)
                return await procFiles(chat, mediaBlob).then(async mc => {
                    var media = mc.models[0];
                    Object.entries(temp.productMsgOptions).map(([k, v]) => media.mediaPrep._mediaData[k] = v)
                    await media.mediaPrep.sendToChat(chat, temp);
                    return chat.lastReceivedKey._serialized;
                });
            });
        }
    })
}

base64ImageToFile = function(b64Data, filename) {
    var arr = b64Data.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = window.Base64 ? window.Base64.atob(arr[1]) : atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};

/**
 * Send contact card to a specific chat using the chat ids
 *
 * @param {string} to '000000000000@c.us'
 * @param {string|array} contact '111111111111@c.us' | ['222222222222@c.us', '333333333333@c.us, ... 'nnnnnnnnnnnn@c.us']
 */
sendContact = function(to, contact) {
    if (!Array.isArray(contact)) {
        contact = [contact];
    }
    contact = contact.map((c) => {
        returngetChat(c).__x_contact;
    });

    if (contact.length > 1) {
        getChat(to).sendContactList(contact);
    } else if (contact.length === 1) {
        getChat(to).sendContact(contact[0]);
    }
};

/**
 * Ghost forwarding is like a normal forward but as if it were sent from the host phone.
 */
ghostForward = async function(chatId, messageId) {
    if (!chatId.includes('@g') && !chatId.includes('@c')) return false;
    var chat = Store.Chat.get(chatId);
    if (!Store.Msg.get(messageId)) return false;
    var tempMsg = Object.create(Store.Msg.get(messageId));
    var newId = getNewMessageId(chatId);
    var extend = {
        ...JSON.parse(JSON.stringify(tempMsg)),
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: new Store.WidFactory.createWid(chatId),
        from: Store.Me.wid,
        isNewMsg: true
    };
    Object.assign(tempMsg, extend);
    const res = await Promise.all(Store.addAndSendMsgToChat(chat, extend))
    return res[1] == 'success';
}


/**
 * Forward an array of messages to a specific chat using the message ids or Objects
 *
 * @param {string} to '000000000000@c.us'
 * @param {string|array[Message | string]} messages this can be any mixture of message ids or message objects
 * @param {boolean} skipMyMessages This indicates whether or not to skip your own messages from the array
 */
forwardMessages = async function(to, messages, skipMyMessages) {
    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    const finalForwardMessages = messages.map(msg => {
        if (typeof msg == 'string') {
            //msg is string, get the message object
            return window.Store.Msg.get(msg);
        } else {
            return window.Store.Msg.get(msg.id);
        }
    }).filter(msg => skipMyMessages ? !msg.__x_isSentByMe : true);

    // let userId = new window.Store.UserConstructor(to);
    let conversation = window.Store.Chat.get(to);
    return await conversation.forwardMessages(finalForwardMessages)
};

/**
 * Create an chat ID based in a cloned one
 *
 * @param {string} chatId '000000000000@c.us'
 */
getNewMessageId = function(chatId) {
    var newMsgId = new Store.MsgKey(Object.assign({}, Store.Msg.models[0].__x_id))
        // .clone();

    newMsgId.fromMe = true;
    newMsgId.id = getNewId().toUpperCase();
    newMsgId.remote = new Store.WidFactory.createWid(chatId);
    newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`

    return newMsgId;
};


/**
 * Simulate '...typing' in the chat.
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {boolean} on true to turn on similated typing, false to turn it off //you need to manually turn this off.
 */
simulateTyping = async function(chatId, on) {
    if (on) Store.ChatStates.sendChatStateComposing(chatId)
    else Store.ChatStates.sendChatStatePaused(chatId)
    return true
};

/**
 * Send location
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {string} lat latitude
 * @param {string} lng longitude
 * @param {string} loc Text to go with the location message
 */
sendLocation = async function(chatId, lat, lng, loc) {
    var chat = Store.Chat.get(chatId);
    if (!chat) return false;
    var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe && !msg.quotedMsg)[0]);
    var newId = getNewMessageId(chatId);
    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: chatId,
        isNewMsg: !0,
        type: "location",
        lat,
        lng,
        loc,
        clientUrl: undefined,
        directPath: undefined,
        filehash: undefined,
        uploadhash: undefined,
        mediaKey: undefined,
        isQuotedMsgAvailable: false,
        invis: false,
        mediaKeyTimestamp: undefined,
        mimetype: undefined,
        height: undefined,
        width: undefined,
        ephemeralStartTimestamp: undefined,
        body: undefined,
        mediaData: undefined,
        isQuotedMsgAvailable: false
    };
    Object.assign(tempMsg, extend);
    return await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg))
};

/**
 * Send VCARD
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {string} vcard vcard as a string
 * @param {string} contactName The display name for the contact. CANNOT BE NULL OTHERWISE IT WILL SEND SOME RANDOM CONTACT FROM YOUR ADDRESS BOOK.
 * @param {string} contactNumber If supplied, this will be injected into the vcard (VERSION 3 ONLY FROM VCARDJS) with the WA id to make it show up with the correct buttons on WA.
 */
sendVCard = async function(chatId, vcard, contactName, contactNumber) {
    var chat = Store.Chat.get(chatId);
    var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe && !msg.quotedMsg)[0]);
    var newId = getNewMessageId(chatId);
    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: chatId,
        isNewMsg: !0,
        type: "vcard",
        clientUrl: undefined,
        directPath: undefined,
        filehash: undefined,
        uploadhash: undefined,
        mediaKey: undefined,
        isQuotedMsgAvailable: false,
        invis: false,
        mediaKeyTimestamp: undefined,
        mimetype: undefined,
        height: undefined,
        width: undefined,
        ephemeralStartTimestamp: undefined,
        body: contactNumber ? vcard.replace('TEL;TYPE=WORK,VOICE:', `TEL;TYPE=WORK,VOICE;waid=${contactNumber}:`) : vcard,
        mediaData: undefined,
        isQuotedMsgAvailable: false,
        subtype: contactName
    };
    Object.assign(tempMsg, extend);
    return (await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg)))[1] == "success"
};

reply = async function(chatId, body, quotedMsg) {
    if (typeof quotedMsg !== "object") quotedMsg = Store.Msg.get(quotedMsg)
    var chat = Store.Chat.get(chatId);
    if (!chat) return false;
    let extras = {};
    if (quotedMsg) {
        extras = {
            quotedParticipant: quotedMsg.author || quotedMsg.from,
            quotedStanzaID: quotedMsg.id.id
        };
    }
    var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe && !msg.quotedMsg)[0]);
    var newId = getNewMessageId(chatId);
    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: new Store.WidFactory.createWid(chatId),
        isNewMsg: !0,
        type: "chat",
        quotedMsg,
        body,
        ...extras
    };
    Object.assign(tempMsg, extend);
    const res = await Promise.all(await Store.addAndSendMsgToChat(chat, tempMsg));
    if (res[1] != 'success') return false;
    return res[0].id._serialized
};

/**
 * Send Payment Request
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {string} amount1000 The amount in base value / 10 (e.g 50000 in GBP = £50)
 * @param {string} currency Three letter currency code (e.g SAR, GBP, USD, INR, AED, EUR)
 * @param {string} note message to send with the payment request
 */
sendPaymentRequest = async function(chatId, amount1000, currency, noteMessage) {
    var chat = Store.Chat.get(chatId);
    var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe && !msg.quotedMsg)[0]);
    var newId = getNewMessageId(chatId);
    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: chatId,
        isNewMsg: !0,
        type: "payment",
        subtype: "request",
        amount1000,
        requestFrom: chatId,
        currency,
        noteMessage,
        expiryTimestamp: parseInt(new Date(new Date().setDate(new Date().getDate() + 1)).getTime() / 1000)
    };
    Object.assign(tempMsg, extend);
    await Store.addAndSendMsgToChat(chat, tempMsg)
};



/**
 * Send Customized VCard without the necessity of contact be a WA Contact
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {object|array} vcard { displayName: 'Contact Name', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name;;;\nEND:VCARD' } | [{ displayName: 'Contact Name 1', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 1;;;\nEND:VCARD' }, { displayName: 'Contact Name 2', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 2;;;\nEND:VCARD' }]
 */
_sendVCard = function(chatId, vcard) {
    var chat = Store.Chat.get(chatId);
    var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe && !msg.quotedMsg)[0]);
    var newId = getNewMessageId(chatId);

    var extend = {
        ack: 0,
        id: newId,
        local: !0,
        self: "out",
        t: parseInt(new Date().getTime() / 1000),
        to: chatId,
        isNewMsg: !0,
        isQuotedMsgAvailable: false,
    };

    if (Array.isArray(vcard)) {
        Object.assign(extend, {
            type: "multi_vcard",
            vcardList: vcard
        });

        delete extend.body;
    } else {
        Object.assign(extend, {
            type: "vcard",
            subtype: vcard.displayName,
            body: vcard.vcard
        });

        delete extend.vcardList;
    }

    Object.assign(tempMsg, extend);

    Store.addAndSendMsgToChat(chat, tempMsg)
};

/**
 * Block contact 
 * @param {string} id '000000000000@c.us'
 */
contactBlock = async function(id) {
        const contact = window.Store.Contact.get(id);
        if (contact !== undefined) {
            await Store.Block.blockContact(contact)
            return true;
        }
        return false;
    }
    /**
     * Unblock contact 
     * @param {string} id '000000000000@c.us'
     */
contactUnblock = async function(id) {
    const contact = window.Store.Contact.get(id);
    if (contact !== undefined) {
        await Store.Block.unblockContact(contact)
        return true;
    }
    return false;
}



getLastSeen = async function(id) {
    if (!Store.Chat.get(id)) return false;
    let { presence } = Store.Chat.get(id)
    await presence.subscribe();
    return presence.chatstate.t;
}

getUseHereString = async function() {
    if (!window.l10n.localeStrings['en']) {
        const originalLocale = window.l10n.getLocale();
        await window.l10n.init('en');
        await window.l10n.init(originalLocale)
    }
    return window.l10n.localeStrings[window.l10n.getLocale()][0][window.l10n.localeStrings.en[0].findIndex(x => x.toLowerCase() === 'use here')]
}

getAmountOfLoadedMessages = function() {
    return Store.Msg.models.length;
}

cutMsgCache = function() {
    Store.Msg.models.map(msg => Store.Msg.remove(msg));
    return true;
}

//All of the following features can be unlocked using a license key: https://github.com/open-wa/wa-automate-nodejs#license-key
getStoryStatusByTimeStamp = function() { return false; }
deleteAllStatus = function() { return false; }
getMyStatusArray = function() { return false; }
deleteStatus = function() { return false; }
setGroupToAdminsOnly = function() { return false; }
setGroupEditToAdminsOnly = function() { return false; }
postTextStatus = function() { return false; }
postImageStatus = function() { return false; }
postVideoStatus = function() { return false; }
onRemovedFromGroup = function() { return false; }
onContactAdded = function() { return false; }
sendReplyWithMentions = function() { return false; }
clearAllChats = function() { return false; }
getCommonGroups = function() { return false; }
setChatBackgroundColourHex = function() { return false; }
darkMode = function() { return false; }
onChatOpened = function() { return false; }
onStory = function() { return false; }

quickClean = function(ob) { return JSON.parse(JSON.stringify(ob)) };


//by Wong Created
//#region

getUnreadMessages_ByWong = () => {
    // const chats = window.Store.Chat.models;
    const chats = Store.Chat.models.filter(chat => chat.unreadCount && chat.unreadCount > 0).map(unreadChat => unreadChat.msgs.models.slice(-1 * unreadChat.unreadCount)).flat();
    let output = [];
    for (let chat in chats) {

        if (isNaN(chat)) {
            continue;
        }
        let messageObj = chats[chat];
        if (messageObj.__x_isUnreadType && !messageObj.isSentByMe && !messageObj.isStatusV3 && !messageObj.isGroupMsg) {
            output.push(messageObj);
            messageObj.__x_isUnreadType = false;
            messageObj.isNewMsg = false;
        }
    }
    return JSON.stringify(output);;
};

sendMessage_ByWong = function(id, message) {
    var chat = getChat(id);
    if (chat !== undefined) {
        try {
            chat.sendMessage(message);
            return true;
        } catch (error) {
            return false;
        }
    }
    return false;
};
//#endregion
