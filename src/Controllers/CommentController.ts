import { Request, Response } from "express";
import Blog from "../Models/blogModel";
import User, { UserDocument } from "../Models/userModel";
// import { validateComment } from "../Models/blogModel";
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
export default class CommentController {
  static async addComment(req: Request, res: Response) {
    const blogId = req.params.blogId as any;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!req.user) {
      return res.status(404).json({ message: "pleas login required" });
    }
    const newcomment = {
      fullName: req.user.fullName,
      comment: req.body.comment,
    };

    blog.comments.push(newcomment);
    const newcom = await blog.save();

    return res.status(201).json(newcom);
  }

  //   ==============================likes==================
  static async likeBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.blogId;

      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (blog.likedBy.includes(req.user.id)) {
        return res
          .status(400)
          .json({ message: "You have already liked this blog" });
      }
      blog.likes++;
      blog.likedBy.push(req.user.id);
      await blog.save();

      return res
        .status(200)
        .json({ message: "Blog liked successfully", likes: blog.likes });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
