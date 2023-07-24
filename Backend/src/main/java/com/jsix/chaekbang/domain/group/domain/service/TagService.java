package com.jsix.chaekbang.domain.group.domain.service;


import com.jsix.chaekbang.domain.group.domain.Tag;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class TagService {

    public List<Tag> getAllTagsRequired(List<Tag> existedTags, List<String> totalTagNames) {
        existedTags.forEach(Tag::plusTaggedCount);

        List<Tag> allTags = new ArrayList<>(existedTags);

        Set<String> existedTagNames = getTagNamesFromTags(existedTags);
        List<Tag> notExistedTags = totalTagNames.stream()
                                                .filter(name -> !existedTagNames.contains(name))
                                                .map(Tag::createTag)
                                                .toList();
        allTags.addAll(notExistedTags);
        return allTags;
    }

    private Set<String> getTagNamesFromTags(List<Tag> tags) {
        return tags.stream()
                   .map(Tag::getTagName)
                   .collect(Collectors.toSet());
    }
}
