const mongoose = require('mongoose');
const {Schema} = mongoose;

const likeSchema = new Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    playlist: {
        type: Schema.Types.ObjectId,
        ref: 'Playlist',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Like', likeSchema);