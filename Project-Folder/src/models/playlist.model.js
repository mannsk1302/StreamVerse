const mongoose = require('mongoose');
const {Schema} = mongoose;

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);