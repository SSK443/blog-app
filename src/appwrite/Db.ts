import config from "../config/config";
import { Client, Databases, Query, Storage, ID, type Models } from "appwrite";
interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  status: "active" | "inactive" | "draft";
  userId: string;
}
export interface PostDocument extends Models.Document {
  title: string;
  content: string;
  featuredImage: string;
  status: "active" | "inactive" | "draft";
  userId: string;
}



interface UpdatePostData {
  title?: string;
  content?: string;
  featuredImage?: string;
  status?: "active" | "inactive" | "draft";
}
class DbService {
  client: Client;
  databases: Databases;
  bucket: Storage;

  constructor() {
    this.client = new Client()
      .setEndpoint(config.vite_appwrite_url)
      .setProject(config.vite_appwrite_project_id);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  // create a post
  async createPost({
  title,
  slug,
  content,
  featuredImage,
  status,
  userId,
}: CreatePostData): Promise<PostDocument> {
  try {
    return await this.databases.createDocument<PostDocument>(
      config.vite_appwrite_db_id,
      config.vite_appwrite_collection_id,
      slug,
      {
        title,
        content,
        featuredImage,
        status,
        userId
      }
    );
  } catch (error) {
    console.error("Error creating post db of appwrite:", error);
    throw error
  }
}


  //update that post
  async updatePost(
    slug: string,
    { title, content, featuredImage, status }: UpdatePostData
  ): Promise<PostDocument> {
    try {
      return await this.databases.updateDocument<PostDocument>(
        config.vite_appwrite_db_id,
        config.vite_appwrite_collection_id,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }
  //delete that post
  async deletePost(slug: string): Promise<void> {
    try {
      await this.databases.deleteDocument(
        config.vite_appwrite_db_id,
        config.vite_appwrite_collection_id,
        slug
      );
    
      
    } catch (error) {
      console.error("Error deleting post:", error);
      
     throw error;
     
    }
  }
  //get a post by slug
  async getPost(slug: string): Promise<PostDocument> {
    try {
      return await this.databases.getDocument<PostDocument>(
        config.vite_appwrite_db_id,
        config.vite_appwrite_collection_id,
        slug
      );
    } catch (error) {
      console.error("Error getting post:", error);
      throw error;
    }
  }
  //active all posts
 async getPosts(
  queries = [Query.equal("status", "active")]
): Promise<Models.DocumentList<PostDocument>> {
  try {
    return await this.databases.listDocuments<PostDocument>(
      config.vite_appwrite_db_id,
      config.vite_appwrite_collection_id,
      queries
    );
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
}



//files service to update

  //file upload service
  async uploadFile(file: File): Promise<Models.File> {
    try {
      return await this.bucket.createFile(
        config.vite_appwrite_bucket_id,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.error("Error uploading file:", error);
       throw error; 
    
    }
  }
  //file delete service
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.bucket.deleteFile(
        config.vite_appwrite_bucket_id,
         fileId
      );
     
    } catch (error) {
      console.error("Error deleting file:", error);
        throw error;
    }
  }

  //file preview service
  // getFilePreview(fileId: string): string {
  //   return this.bucket.getFilePreview(
  //     config.vite_appwrite_bucket_id,
  //      fileId
  //     );
  // }
  getFileView(fileId: string): string {
  return this.bucket.getFileView(
    config.vite_appwrite_bucket_id,
    fileId
  );
}
}
const dbService = new DbService();

export default dbService;
