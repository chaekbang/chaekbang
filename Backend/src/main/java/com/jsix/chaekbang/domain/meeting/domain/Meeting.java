package com.jsix.chaekbang.domain.meeting.domain;

import com.jsix.chaekbang.domain.group.domain.Group;
import com.jsix.chaekbang.domain.user.domain.User;
import com.jsix.chaekbang.global.entity.BaseEntity;
import com.jsix.chaekbang.global.exception.NotGroupUserException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Meeting extends BaseEntity {

    @Id
    @Column(name = "meeting_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime closedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "meeting", cascade = CascadeType.ALL)
    private List<MeetingUser> meetingUsers = new ArrayList<>();

    @OneToMany(mappedBy = "meeting", fetch = FetchType.LAZY)
    private List<OpinionBox> opinionBoxes = new ArrayList<>();

    public void addOpinionBox(OpinionBox opinionBox) {
        this.opinionBoxes.add(opinionBox);
    }

    @Builder
    private Meeting(String title, LocalDateTime startedAt, Group group) {
        this.title = title;
        this.startedAt = startedAt;
        this.group = group;
    }

    public static Meeting createMeeting(String title, LocalDateTime startedAt, Group group) {
        Meeting meeting = Meeting.builder()
            .title(title)
            .startedAt(startedAt)
            .group(group)
            .build();
        group.addMeeting(meeting);
        return meeting;
    }

    public boolean isClose() {
        return this.closedAt != null;
    }

    public void close(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public void validateUser(User user) {
        if (!group.checkExistedUser(user)) {
            throw new NotGroupUserException();
        }
    }
}
