import { Router } from "express";
import { BlogController } from "./blog.controller";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { CreateBlogDTO } from "./dto/create-blog.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class BlogRouter {
  private router: Router;
  private blogController: BlogController;
  private uploaderMiddleware: UploaderMiddleware;
  private jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.jwtMiddleware = new JwtMiddleware();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.uploaderMiddleware
        .upload()
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      validateBody(CreateBlogDTO),
      this.blogController.createBlog
    );
  };

  getRouter = () => {
    return this.router;
  };
}
