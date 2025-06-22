from users.models import Notification, Favorite
 
def sendNotify(chapter):
    # print("sendNotify called for chapter:", chapter)
    if hasattr(chapter, 'novel'):
        item = chapter.novel
        title = item.title
        chapter_number = chapter.chapter_number
        _type = 'novel'
        link = f"novel/{item._id}"
    
    elif hasattr(chapter, 'manga'):
        item = chapter.manga
        title = item.title
        chapter_number = chapter.chapter_number
        _type = 'manga'
        link = f"manga/{item._id}"

    else:
        return
    
    favs = Favorite.objects.filter(object_id = item._id, type=_type)

    for fav in favs:
        Notification.objects.create(
            user=fav.user,
            message=f"Truyện {title} vừa cập nhật chương {chapter_number}",
            link=link
        )

def sendNotifyComment(comment):
    user_comment = comment.user
    if not comment.parent:
        return
    replied_user = comment.parent.user
    if replied_user == user_comment:
        return
    content = comment.content[:50]  
    _type = comment.content_type.model
    postID = comment.object_id
    link = f"{_type}/{postID}"

    # Nếu comment này là reply (có parent), gửi notification cho người comment cha
    if comment.parent and comment.parent.user != comment.user:
        Notification.objects.create(
            user=replied_user,
            message=f"{user_comment.username} đã trả lời bình luận của bạn: {content}",
            link=link
        )