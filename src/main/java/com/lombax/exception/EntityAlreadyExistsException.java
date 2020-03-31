package com.lombax.exception;

import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

public class EntityAlreadyExistsException extends RuntimeException {

    public EntityAlreadyExistsException(Class clazz, String... registerParamsMap) {
        super(EntityAlreadyExistsException.generateMessage(clazz.getSimpleName(), toMap(String.class, String.class, registerParamsMap)));
    }

    private static String generateMessage(String entity, Map<String, String> registerParamsMap) {
        return "The " + registerParamsMap + " already exists in another " +
                StringUtils.capitalize(entity);
    }

    private static <K, V> Map<K, V> toMap(
            Class<K> keyType, Class<V> valueType, Object... entries) {
        if (entries.length % 2 == 1)
            throw new IllegalArgumentException("Invalid entries");
        return IntStream.range(0, entries.length / 2).map(i -> i * 2)
                .collect(HashMap::new,
                        (m, i) -> m.put(keyType.cast(entries[i]), valueType.cast(entries[i + 1])),
                        Map::putAll);
    }

}
