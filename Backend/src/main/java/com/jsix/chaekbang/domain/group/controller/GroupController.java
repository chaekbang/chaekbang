package com.jsix.chaekbang.domain.group.controller;

import com.jsix.chaekbang.domain.group.application.GroupCreateUseCase;
import com.jsix.chaekbang.domain.group.application.GroupJoinUseCase;
import com.jsix.chaekbang.domain.group.application.GroupModifyUseCase;
import com.jsix.chaekbang.domain.group.application.GroupSearchUseCase;
import com.jsix.chaekbang.domain.group.dto.GroupCreateRequestDto;
import com.jsix.chaekbang.domain.group.dto.GroupJoinRequestDto;
import com.jsix.chaekbang.domain.group.dto.GroupParticipantResponseDto;
import com.jsix.chaekbang.domain.group.dto.GroupModifyRequestDto;
import com.jsix.chaekbang.domain.group.dto.GroupSearchRequestDto;
import com.jsix.chaekbang.domain.group.dto.GroupWithUserAndTagResponseDto;
import com.jsix.chaekbang.domain.group.dto.UserGroupResponseDto;
import com.jsix.chaekbang.global.config.webmvc.AuthUser;
import com.jsix.chaekbang.global.config.webmvc.JwtLoginUser;
import com.jsix.chaekbang.global.dto.HttpResponse;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupCreateUseCase groupCreateUseCase;
    private final GroupSearchUseCase groupSearchUseCase;
    private final GroupModifyUseCase groupModifyUseCase;

    private final GroupJoinUseCase groupJoinUseCase;

    @PostMapping
    public ResponseEntity<?> createGroup(@JwtLoginUser AuthUser authUser,
            @ModelAttribute @Valid GroupCreateRequestDto groupCreateRequestDto) {
        groupCreateUseCase.createGroup(authUser, groupCreateRequestDto);
        return HttpResponse.ok(HttpStatus.CREATED, "모임이 생성되었습니다.");
    }

    @GetMapping("/popular")
    public ResponseEntity<?> searchPopularGroups() {
        return HttpResponse.okWithData(HttpStatus.OK, "인기 모임 조회 성공했습니다.",
                groupSearchUseCase.findPopularGroups());
    }

    @GetMapping("/recommended")
    public ResponseEntity<?> searchRecommendedGroups() {
        return HttpResponse.okWithData(HttpStatus.OK, "추천 모임 조회 성공했습니다.",
                groupSearchUseCase.findRecommendedGroups());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchGroupsByKeywordAndTags(
            GroupSearchRequestDto groupSearchRequestDto) {
        List<GroupWithUserAndTagResponseDto> responseGroups = groupSearchUseCase.searchGroupByKeywordAndTags(
                groupSearchRequestDto);
        return HttpResponse.okWithData(HttpStatus.OK, "그룹 내역 조회 성공했습니다.", responseGroups);
    }

    @GetMapping("/{group_id}")
    public ResponseEntity<?> searchGroupDetail(
            @PathVariable("group_id")
            @Min(1) long groupId) {
        return HttpResponse.okWithData(HttpStatus.OK, "그룹 조회 성공했습니다.",
                groupSearchUseCase.searchGroupDetail(groupId));
    }

    @GetMapping("/{group_id}/members")
    public ResponseEntity<?> searchGroupUsers(
            @PathVariable("group_id")
            @Min(1) long groupId) {
        return HttpResponse.okWithData(HttpStatus.OK, "그룹 회원 조회 성공했습니다.",
                groupSearchUseCase.searchGroupUsers(groupId));
    }

    @PostMapping("/{group_id}/applications")
    public ResponseEntity<?> joinGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser user, @RequestBody @Valid GroupJoinRequestDto groupJoinRequestDto) {
        groupJoinUseCase.joinGroup(groupId, user, groupJoinRequestDto);
        return HttpResponse.ok(HttpStatus.OK, "그룹 참여 신청 성공했습니다.");
    }

    @Validated
    @DeleteMapping("/{group_id}/applications")
    public ResponseEntity<?> cancelJoinGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser user) {

        groupJoinUseCase.cancelJoinGroup(groupId, user);
        return HttpResponse.ok(HttpStatus.OK, "그룹 참여 신청 취소했습니다.");
    }

    @Validated
    @PatchMapping("/{group_id}/leaders/applications")
    public ResponseEntity<?> approveJoinGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser leader, @RequestParam @Min(1) Long userId) {

        groupJoinUseCase.approveJoinGroup(groupId, leader, userId);
        return HttpResponse.ok(HttpStatus.OK, "그룹 참여 승인했습니다.");
    }

    @Validated
    @DeleteMapping("/{group_id}/leaders/applications")
    public ResponseEntity<?> disapproveJoinGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser leader, @RequestParam @Min(1) Long userId) {

        groupJoinUseCase.disapproveJoinGroup(groupId, leader, userId);
        return HttpResponse.ok(HttpStatus.OK, "그룹 참여 거절했습니다.");
    }

    @Validated
    @DeleteMapping("/{group_id}/leaders/members")
    public ResponseEntity<?> withdrawGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser leader, @RequestParam @Min(1) Long userId) {
        groupJoinUseCase.withdrawGroup(groupId, leader, userId);
        return HttpResponse.ok(HttpStatus.OK, "그룹에서 강퇴했습니다.");
    }

    @DeleteMapping("/{group_id}/members")
    public ResponseEntity<?> leaveGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser user) {
        groupJoinUseCase.leaveGroup(groupId, user);
        return HttpResponse.ok(HttpStatus.OK, "그룹에서 나갔습니다.");
    }

    @GetMapping("/my-groups")
    public ResponseEntity<?> searchMyActiveGroups(@JwtLoginUser AuthUser user) {
        List<UserGroupResponseDto> userGroupResponseDtoList = groupSearchUseCase.searchMyActiveGroups(
                user);
        return HttpResponse.okWithData(HttpStatus.OK, "내 그룹 조회 성공했습니다.", userGroupResponseDtoList);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> searchMyWaitingGroups(@JwtLoginUser AuthUser user) {
        List<UserGroupResponseDto> userGroupResponseDtoList = groupSearchUseCase.searchMyWaitingGroups(
                user);
        return HttpResponse.okWithData(HttpStatus.OK, "내 참여 신청 목록 조회 성공했습니다.",
                userGroupResponseDtoList);
    }

    @GetMapping("/my-history")
    public ResponseEntity<?> searchMyGroupHistory(@JwtLoginUser AuthUser user) {
        List<UserGroupResponseDto> userGroupResponseDtoList = groupSearchUseCase.searchMyGroupHistory(
                user);
        return HttpResponse.okWithData(HttpStatus.OK, "내 그룹 기록 조회 성공했습니다.",
                userGroupResponseDtoList);
    }

    @GetMapping("/{group_id}/leaders/applications")
    public ResponseEntity<?> searchGroupParticipants(
            @PathVariable("group_id") @Min(1) long groupId, @JwtLoginUser AuthUser leader) {
        List<GroupParticipantResponseDto> groupUserResponseDtoList = groupSearchUseCase.searchGroupParticipant(
                groupId, leader);
        return HttpResponse.okWithData(HttpStatus.OK, "그룹에 참여 신청한 사용자 목록 조회 성공했습니다.",
                groupUserResponseDtoList);
    }


    @PatchMapping("/{group_id}")
    public ResponseEntity<?> modifyGroup(@PathVariable("group_id") @Min(1) Long groupId,
            @JwtLoginUser AuthUser leader,
            @ModelAttribute @Valid GroupModifyRequestDto groupModifyRequestDto) {
        groupModifyUseCase.modifyGroup(leader, groupId, groupModifyRequestDto);
        return HttpResponse.ok(HttpStatus.OK, "그룹 수정 성공했습니다.");
    }

    @GetMapping("/members/{user_id}")
    public ResponseEntity<?> searchUserActiveGroups(@PathVariable("user_id") long userId) {
        List<UserGroupResponseDto> userGroupResponseDtoList = groupSearchUseCase.searchUserActiveGroups(
                userId);
        return HttpResponse.okWithData(HttpStatus.OK, "유저 그룹 조회 성공했습니다.", userGroupResponseDtoList);
    }

    @GetMapping("/members/{user_id}/history")
    public ResponseEntity<?> searchUserGroupHistory(@PathVariable("user_id") long userId) {
        List<UserGroupResponseDto> userGroupResponseDtoList = groupSearchUseCase.searchUserGroupHistory(
                userId);
        return HttpResponse.okWithData(HttpStatus.OK, "유저 그룹 기록 조회 성공했습니다.",
                userGroupResponseDtoList);
    }

    @GetMapping("/{group_id}/info")
    public ResponseEntity<?> searchGroupDetailForUpdate(
            @PathVariable("group_id")
            @Min(1) long groupId) {
        return HttpResponse.okWithData(HttpStatus.OK, "그룹 조회 성공했습니다.",
                groupSearchUseCase.searchGroupDetailForUpdate(groupId));
    }

    @GetMapping("/{group_id}/status")
    public ResponseEntity<?> searchGroupUserStatus(
            @PathVariable("group_id")
            @Min(1) long groupId, @JwtLoginUser AuthUser user) {
        return HttpResponse.okWithData(HttpStatus.OK, "그룹 참여 신청 여부 조회 성공했습니다.",
                groupSearchUseCase.searchGroupUserStatus(groupId, user));
    }
}
