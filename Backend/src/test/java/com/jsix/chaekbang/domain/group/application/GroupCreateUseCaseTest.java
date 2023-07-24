package com.jsix.chaekbang.domain.group.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.jsix.chaekbang.domain.group.application.repository.GroupRepository;
import com.jsix.chaekbang.domain.group.application.repository.TagRepository;
import com.jsix.chaekbang.domain.group.domain.Group;
import com.jsix.chaekbang.domain.group.domain.Tag;
import com.jsix.chaekbang.domain.group.domain.service.TagService;
import com.jsix.chaekbang.domain.group.dto.GroupCreateRequestDto;
import com.jsix.chaekbang.domain.user.application.repository.UserRepository;
import com.jsix.chaekbang.domain.user.domain.Gender;
import com.jsix.chaekbang.domain.user.domain.OAuthProvider;
import com.jsix.chaekbang.domain.user.domain.User;
import java.lang.reflect.Constructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class GroupCreateUseCaseTest {

    @Mock
    GroupRepository groupRepository;
    @Mock
    TagRepository tagRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    TagService tagService;
    @InjectMocks
    GroupCreateUseCase groupCreateUseCase;

    GroupCreateRequestDto groupCreateRequestDto;
    User leader;
    List<Tag> allTags;
    List<Tag> existedTags;

    @BeforeEach
    void setUp() throws Exception {
        setGroupCreateRequestDto();
        setLeader();
        setExistedTags();
        setAllTags();
    }

    @DisplayName("그룹을 생성하고 저장할 수 있다.")
    @Test
    void 그룹_생성_성공() {
        // given
        Long leaderId = 1L;
        given(userRepository.findById(any(Long.class))).willReturn(Optional.ofNullable(leader));
        given(tagRepository.findByTagNameIn(any(List.class))).willReturn(existedTags);
        given(tagService.getAllTagsRequired(any(List.class), any(List.class)))
                .willReturn(allTags);

        // when
        groupCreateUseCase.createGroup(leaderId, groupCreateRequestDto);
        // createGruop 메서드 내부에서 생성된 createdGroup 객체를 가져온다.
        ArgumentCaptor<Group> groupArgumentCaptor = ArgumentCaptor.forClass(Group.class);
        verify(groupRepository).save(groupArgumentCaptor.capture());
        Group createdGroup = groupArgumentCaptor.getValue();

        // then
        verify(groupRepository, times(1)).save(any(Group.class));
    }

    void setGroupCreateRequestDto() throws Exception {
        // dto 의 생성 제한을 강제로 바꿔준다.
        Class<?> clazz = Class.forName("com.jsix.chaekbang.domain.group.dto.GroupCreateRequestDto");
        Constructor<?> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);

        // dto 생성
        groupCreateRequestDto = (GroupCreateRequestDto) constructor.newInstance();
        List<String> tagNames = new ArrayList<>();
        tagNames.add("TAG1");
        ReflectionTestUtils.setField(groupCreateRequestDto, "title", "TITLE");
        ReflectionTestUtils.setField(groupCreateRequestDto, "detail", "DETAIL");
        ReflectionTestUtils.setField(groupCreateRequestDto, "question", "QUESTION");
        ReflectionTestUtils.setField(groupCreateRequestDto, "tagNames", tagNames);
    }

    void setLeader() {
        leader = User.createUser(OAuthProvider.GOOGLE, "oAuthId", "email", Gender.M,
                LocalDate.now(), "profileImageUrl", "aboutMe", "nickName");
        ReflectionTestUtils.setField(leader, "id", 1L);
    }

    void setAllTags() {
        allTags = new ArrayList<>(List.of(Tag.createTag("TAG1")));
    }

    void setExistedTags() {
        existedTags = new ArrayList<>();
    }


}