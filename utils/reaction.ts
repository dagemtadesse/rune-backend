import { Comment, CommentReaction, Post, PostReaction, Vote } from "@prisma/client";

interface Count {
    downVote: Number,
    upVote: Number,
    vote: String,
    commentReaction?: any
}

export function countReaction(userId: Number, post: {reactions: PostReaction[] | CommentReaction[]} | null) {
    if(!post){
        return null;
    }

    let upVote = 0, downVote = 0, vote: String = "NONE";
    post.reactions.forEach(reaction => {
        if(reaction.vote == Vote.DOWN_VOTE) downVote++;
        if(reaction.vote == Vote.UP_VOTE) upVote++;
        if(reaction.userId == userId){
            vote = reaction.vote
        }
    });

    let modified = post as any;
    delete modified.reactions;

    modified.upVote = upVote;
    modified.downVote = downVote;
    modified.vote = vote;

    return modified;
}