

import  { useEffect, useCallback,  } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dbService from "../../appwrite/Db";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import RTE from "../RTE";
import  {Selection, CommonBtn, CommonInput } from "../index";
import type { PostDocument } from "../../appwrite/Db";
interface PostPROPS {
  post?: PostDocument;
}

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  status: "active" | "inactive" | "draft";
  featuredImage?: FileList;
}

function PostForm({ post }: PostPROPS) {
  const navigate = useNavigate();

  const userData = useSelector(
    (state: RootState) => state.auth.userDetails
  );

  // const { register, handleSubmit ,watch,setValue,control,getValues} =
  //   useForm< PostFormData>({
  //     defaultValues: {
  //       title: post?.title || "",
  //       slug: post?.slug || "",
  //       content: post?.content || "",
  //       status: post?.status || "active",
  //     },
  //   });


  //this is new version of submit function with slug auto generation and also i have added useCallback for slug transformation and also added useEffect for watching title change and update slug accordingly.
  const { register, handleSubmit, watch, setValue, control, reset } =
  useForm<PostFormData>({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "active",

    },
  });

useEffect(() => {
  if (post) {
    reset({
      title: post.title,
        slug: post.$id,  
      content: post.content,
      status: post.status,
    });
  }
}, [post, reset]);

/////submit function
const submit = async (data: PostFormData) => {
  try {
    const file = data.featuredImage?.[0]
      ? await dbService.uploadFile(data.featuredImage[0]) // i have doubt uploadFile if post exist.
      : null;

    if (post) {
      const updatedFileId = file ? file.$id : post.featuredImage;

      const dbPost = await dbService.updatePost(post.$id, {
        title: data.title,
        content: data.content,
        status: data.status,
        featuredImage: updatedFileId,
      
      });

      if (file && post.featuredImage) {
        await dbService.deleteFile(post.featuredImage);
      }

      navigate(`/post/${dbPost.$id}`);
    } else {
      if (!userData) {
  console.error("User not authenticated");
  return;
}

      const dbPost = await dbService.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: file ? file.$id : "",
        userId: userData.$id,
      });
      console.log("Created userdata come :", userData);

      navigate(`/post/${dbPost.$id}`);
    }
  } catch (error) {
    console.error("Error submitting post form:", error);
  }
};

const slugTransform=useCallback((value:string):string=>{
  if(value && typeof value==="string"){
    return value.trim().toLowerCase().replace(/[^a-zA-Z\d]+/g,"-").replace(/^-+|-+$/g,"");
  }else{
    return ""
  }
},[])

useEffect(()=>{

  const subscription=watch((value,{name})=>{
    if(name==="title"){
      setValue("slug",slugTransform(value.title || ""),{shouldValidate:true})
    }
  })
  return ()=>{
    subscription.unsubscribe();
    
  }
},[watch,slugTransform,setValue])


 return (
  <div className="min-h-screen bg-white dark:bg-slate-900 py-10 px-4">
    <div className="max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
          {post ? "Edit Post" : "Create New Post"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Fill in the details below to publish your content.
        </p>
      </div>


      <div className="bg-gray-50 dark:bg-slate-950 
                      border border-gray-200 dark:border-slate-800 
                      rounded-2xl shadow-sm p-6">

        <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <CommonInput
              label="Title"
              placeholder="Enter the post title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
            />

            <CommonInput
              label="Slug"
              placeholder="Auto-generated or edit manually"
              {...register("slug", {
                required: "Slug is required",
              })}
              onInput={(e) =>
                setValue(
                  "slug",
                  slugTransform(e.currentTarget.value),
                  { shouldValidate: true }
                )
              }
            />

            <RTE<PostFormData>
              label="Content"
              name="content"
              control={control}
             
            />

          </div>

        
          <div className="space-y-6">

            <div className="bg-white dark:bg-slate-900 
                            border border-gray-200 dark:border-slate-800 
                            rounded-xl p-4 space-y-4">

              <CommonInput
                label="Featured Image"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                {...register("featuredImage", {
                  required: post ? false : "Featured image is required",
                })}
              />

              {post?.featuredImage && (
                <div className="mt-3">
                  <img
                    src={dbService.getFileView(post.featuredImage)}
                    alt={post.title}
                    className="rounded-lg border border-gray-200 dark:border-slate-800"
                  />
                </div>
              )}

              <Selection
                options={["active", "inactive", "draft"]}
                label="Status"
                {...register("status", {
                  required: "Status is required",
                })}
              />

              <CommonBtn
                type="submit"
                size="lg"
                className="w-full"
                variant="primary"
              >
                {post ? "Update Post" : "Publish Post"}
              </CommonBtn>

            </div>

          </div>

        </form>

      </div>
    </div>
  </div>
);
}

export default PostForm;
