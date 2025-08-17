package basilium.basiliumserver.domain.review.entity;

import basilium.basiliumserver.domain.product.entity.Product;
import basilium.basiliumserver.domain.user.entity.NormalUser;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "review")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "normal_user_number", nullable = false)
    private NormalUser user;

    @Column(name = "purchase_size", nullable = false)
    private String purchaseSize;

    @Column(name = "purchase_color", nullable = false)
    private String purchaseColor;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int rating;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(length = 1000, nullable = false)
    private String comment;

    /** 리뷰 이미지: DB에는 '파일명'만 저장 */
    @BatchSize(size = 20)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_file_name", length = 255)
    @Builder.Default
    private List<String> reviewImageUrls = new ArrayList<>();

    @Column(updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 변경 메서드
    public void addReviewImageUrl(String fileName) {
        this.reviewImageUrls.add(fileName);
    }

    public void updateContent(String title, String comment) {
        this.title = title;
        this.comment = comment;
    }

    // Getters
    public Long getReviewId() { return reviewId; }
    public Product getProduct() { return product; }
    public NormalUser getUser() { return user; }
    public String getPurchaseSize() { return purchaseSize; }
    public String getPurchaseColor() { return purchaseColor; }
    public int getRating() { return rating; }
    public String getTitle() { return title; }
    public String getComment() { return comment; }
    public List<String> getReviewImageUrls() { return reviewImageUrls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
