import dbService from "../appwrite/Db";
import { Link } from "react-router-dom";
import type { PostDocument } from "../appwrite/Db";

function PostCard({ $id, featuredImage, title, content }: PostDocument) {

  const plainText = content.replace(/<[^>]+>/g, "");
  
  const newImgUrl=dbService.getFileView(featuredImage);
 

  return (
    <Link to={`/post/${$id}`} className="block group">
      <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

        <div className="w-full h-48 overflow-hidden">
          <img
            src={newImgUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4 space-y-3">

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {plainText.length > 100
              ? plainText.substring(0, 100) + "..."
              : plainText}
          </p>

        </div>
      </div>
    </Link>
  );
}

export default PostCard;