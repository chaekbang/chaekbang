package com.jsix.chaekbang.domain.group.infra.database;

import com.jsix.chaekbang.domain.group.application.repository.TagRepository;
import com.jsix.chaekbang.domain.group.domain.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TagRepositoryImpl implements TagRepository {

    private final JpaTagRepository jpaTagRepository;

    @Override
    public Tag save(Tag tag) {
        return jpaTagRepository.save(tag);
    }

    @Override
    public List<Tag> saveAll(List<Tag> tags) {
        return jpaTagRepository.saveAll(tags);
    }

    @Override
    public List<Tag> findByTagNameIn(List<String> tagNames) {
        return jpaTagRepository.findByTagNameIn(tagNames);
    }
}
