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
      return res.status(401).json({ message: "pleas login required" });
    }
    const newcomment = {
      fullName: req.user.fullName,
      comment: req.body.comment,
    };

    blog.comments.push(newcomment);
    const newcom = await blog.save();

    return res
      .status(201)
      .json({ newcom, message: "Comment added successfully" });
  }

  //   ==============================likes==================
  static async likeBlog(req: Request, res: Response) {
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "pleas login required" });
    }
    const userId = req.user.id;
    const userIndex = blog.likedBy.indexOf(userId);

    if (userIndex !== -1) {
      blog.likes--;
      blog.likedBy.splice(userIndex, 1);
    } else {
      blog.likes++;
      blog.likedBy.push(userId);
    }

    await blog.save();

    return res
      .status(200)
      .json({ message: "Blog like/unlike", likes: blog.likes });
  }
}
