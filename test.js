this.listenforPushNotifications();
    }

    listenforPushNotifications() {
        if (this.state.appState === null) {
            this.setState({appState: 'active'});
        } else {
            return;
        }

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then((url) => {
                if (url) {
                     utils.timestampedLog('Initial external URL: ' + url);
                     this.eventFromUrl(url);
                      this.changeRoute('/login', 'start up');
                } else {
                      this.changeRoute('/login', 'start up');
                }
            }).catch(err => {
                logger.error({ err }, 'Error getting external URL');
            });

            firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    this._onPushRegistered(fcmToken);
                }
            });

            Linking.addEventListener('url', this.updateLinkingURL);

        } 

        if (Platform.OS === 'android') {
            AppState.addEventListener('focus', this._handleAndroidFocus);
            AppState.addEventListener('blur', this._handleAndroidBlur);

            firebase
                .messaging()
                .requestPermission()
                .then(() => {
                    // User has authorised
                })
                .catch(error => {
                    // User has rejected permissions
                });

            this.messageListener = firebase
                .messaging()
                .onMessage((message: RemoteMessage) => {
                    // this will just wake up the app to receive
                    // the web-socket invite handled by this.incomingCall()
                    let event = message.data.event;
                    const callUUID = message.data['session-id'];
                    const from = message.data['from_uri'];
                    const to = message.data['to_uri'];
                    const displayName = message.data['from_display_name'];
                    const outgoingMedia = {audio: true, video: message.data['media-type'] === 'video'};
                    const mediaType = message.data['media-type'] || 'audio';

                    if (this.unmounted) {
                        return;
                    }

                    if (event === 'incoming_conference_request') {
                        utils.timestampedLog('Push notification: incoming conference', callUUID);
                        this.incomingConference(callUUID, to, from, displayName, outgoingMedia);
                    } else if (event === 'incoming_session') {
                        utils.timestampedLog('Push notification: incoming call', callUUID);
                        this.incomingCallFromPush(callUUID, from, displayName, mediaType);
                    } else if (event === 'cancel') {
                        this.cancelIncomingCall(callUUID);
                    }
                });
        }
    }


    updateLinkingURL = (event) => {
        // this handles the use case where the app is running in the background and is activated by the listener...
        //console.log('Updated Linking url', event.url);
        this.eventFromUrl(event.url);
        DeepLinking.evaluateUrl(event.url);
    }

    eventFromUrl(url) {
        url = decodeURI(url);

        try {
            let direction;
            let event;
            let callUUID;
            let from;
            let to;
            let displayName;

            var url_parts = url.split("/");
            let scheme = url_parts[0];
            //console.log(url_parts);

            if (scheme === 'sylk:') {
                //sylk://conference/incoming/callUUID/from/to/media - when Android is asleep
                //sylk://call/outgoing/callUUID/to/displayName - from system dialer/history
                //sylk://call/incoming/callUUID/from/to/displayName - when Android is asleep
                //sylk://call/cancel//callUUID - when Android is asleep

                event       = url_parts[2];
                direction   = url_parts[3];
                callUUID    = url_parts[4];
                from        = url_parts[5];
                to          = url_parts[6];
                displayName = url_parts[7];
                mediaType   = url_parts[8] || 'audio';

                if ( event !== 'cancel' && from && from.search( '@videoconference.' ) > -1) {
                    event = 'conference';
                    to = from;
                }

                this.setState({targetUri: from});

            }
