package com.jsix.chaekbang.domain.meeting.domain;

import com.jsix.chaekbang.domain.user.domain.User;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Opinion {

    @Id
    @Column(name = "opinion_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String opinion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opinion_box_id", nullable = false)
    private OpinionBox opinionBox;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder
    private Opinion(String opinion, OpinionBox opinionBox, User user) {
        this.opinion = opinion;
        this.opinionBox = opinionBox;
        this.user = user;
    }

    public static Opinion createOpinion(String opinion, OpinionBox opinionBox, User user) {
        Opinion createdOpinion = Opinion.builder()
                                        .opinion(opinion)
                                        .opinionBox(opinionBox)
                                        .user(user)
                                        .build();
        opinionBox.addOpinion(createdOpinion);
        return createdOpinion;
    }
}
