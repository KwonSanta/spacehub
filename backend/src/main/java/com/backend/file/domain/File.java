package com.backend.file.domain;

import lombok.Data;

@Data
public class File {
    private int fileListId;
    private int parentId;
    private String division;
    private String fileName;
}
