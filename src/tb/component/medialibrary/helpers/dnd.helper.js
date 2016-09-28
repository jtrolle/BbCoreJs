define(
    [
        'Core',
        'component!notify'
    ],

    function (Core) {
        "use strict";
        var trans = Core.get("trans"),

            DnDHandler = new JS.Class({

                initialize: function (medialibrary) {
                    this.medialibrary = medialibrary;
                    this.medialibrary.mediaFolderTreeView.on("itemdrop", this.changeMediaFolder.bind(this));
                },

                changeMediaFolder: function (e, folder, mediaItem) {
                    var self = this,
                        errorLabel = trans("media_already_in_folder"),
                        okLabel = trans("media_to_folder");


                    /* user mediadatastore to move the folder */
                    if (mediaItem.media_folder !== folder.uid) {
                        mediaItem.media_folder = folder.uid;
                        self.medialibrary.mediaDataStore.save(mediaItem).done(function () {
                            okLabel = okLabel.replace(/\{0\}/gi, "[" + mediaItem.title + "]").replace(/\{1\}/gi, "[" + folder.title + "]");
                            require('component!notify').success(okLabel);
                        });

                    } else {
                        errorLabel = errorLabel.replace(/\{0\}/gi, "[" + mediaItem.title + "]").replace(/\{1\}/gi, "[" + folder.title + "]");
                        require('component!notify').warning(errorLabel);
                    }
                    return e;
                }

            });

        return {
            setMaintWidget: function (medialibrary) {
                return new DnDHandler(medialibrary);
            }
        };

    }

);