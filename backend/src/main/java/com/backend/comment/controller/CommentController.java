package com.backend.comment.controller;

import com.backend.comment.domain.Comment;
import com.backend.comment.service.CommentService;
import com.backend.comment.service.impl.CommentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    final CommentService commentService;
    private final CommentServiceImpl commentServiceImpl;

    @PostMapping("write")
    @PreAuthorize("isAuthenticated()")
    public void write(@RequestBody Comment comment, Authentication authentication) {

        if (commentServiceImpl.validate(comment)) {
            commentService.insert(comment, authentication);
        }
    }

    @GetMapping("list/{boardId}")
    public List<Comment> list(@PathVariable Integer boardId) {
        return commentService.list(boardId);
    }

    @DeleteMapping("delete")
    @PreAuthorize("isAuthenticated()")
    public void delete(@RequestBody Comment comment,
                       Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.delete(comment);
        }
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public void edit(@RequestBody Comment comment,
                     Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.update(comment);
        }
    }

    // space의 review
    @PostMapping("writeReview")
    public void writeReview(Comment comment,
                            Authentication authentication,
                            @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        commentService.insertReview(comment, authentication, files);
    }

    @GetMapping("listReview/{spaceId}")
    public List<Comment> listReview(@PathVariable Integer spaceId) {
        return commentService.listReview(spaceId);
    }

    @DeleteMapping("deleteReview")
    @PreAuthorize("isAuthenticated()")
    public void deleteReview(@RequestBody Comment comment,
                             Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.deleteReview(comment);
        }

    }

    @PutMapping("editReview")
    @PreAuthorize("isAuthenticated()")
    public void editReview(Comment comment,
                           @RequestParam(value = "removeFileList[]", required = false)
                           List<String> removeFileList,
                           @RequestParam(value = "addFileList[]", required = false)
                           MultipartFile[] addFileList,
                           Authentication authentication) throws IOException {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.updateReview(comment, removeFileList, addFileList);
        }
    }


    // space의 qna
    @PostMapping("writeQna")
    @PreAuthorize("isAuthenticated()")
    public void writeQna(@RequestBody Comment comment, Authentication authentication) {
        commentService.insertQna(comment, authentication);

    }

    @GetMapping("listQna/{spaceId}")
    public List<Comment> listQna(@PathVariable Integer spaceId) {
        return commentService.listQna(spaceId);
    }

    @DeleteMapping("deleteQna")
    @PreAuthorize("isAuthenticated()")
    public void deleteQna(@RequestBody Comment comment, Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.deleteQna(comment);
        }
    }

    @PutMapping("editQna")
    @PreAuthorize("isAuthenticated()")
    public void editQna(@RequestBody Comment comment, Authentication authentication) {
        if (commentService.hasAccess(comment, authentication)) {
            commentService.update(comment);
        }
    }
}
