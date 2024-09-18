package br.com.cauaqroz.ConectaPlus.service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class FileStorageService implements IFileStorageService {

    private final GridFSBucket gridFSBucket;

    public FileStorageService(MongoDatabaseFactory dbFactory) {
        this.gridFSBucket = GridFSBuckets.create(dbFactory.getMongoDatabase());
    }

    @Override
    public String uploadFile(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            GridFSUploadOptions options = new GridFSUploadOptions()
                    .metadata(new org.bson.Document("contentType", file.getContentType()));

            ObjectId fileId = gridFSBucket.uploadFromStream(file.getOriginalFilename(), inputStream, options);
            return fileId.toHexString();
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    @Override
    public InputStream downloadFile(String fileId) {
        return gridFSBucket.openDownloadStream(new ObjectId(fileId));
    }
}