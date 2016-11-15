package com.rocket.vitalis.utils;

import com.google.common.collect.Sets;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

import static org.springframework.http.HttpMethod.*;

/**
 * Created by sscotti on 5/17/16.
 */
@Slf4j
@Component
public class RestClient {

    private final RestTemplate restTemplate;

    @Autowired
    public RestClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public RestClientBuilder create(String uri) {
        return new RestClientBuilder(uri);
    }

    public RestClientBuilder create(String host, int port) {
        return new RestClientBuilder("http", host, port);
    }

    public RestClientBuilder create(String scheme, String host, int port) {
        return new RestClientBuilder(scheme, host, port);
    }

    public class RestClientBuilder {

        private UriComponentsBuilder componentsBuilder;
        private HttpHeaders headers;
        private Object payload;

        RestClientBuilder(String uri) {
            this.componentsBuilder = UriComponentsBuilder.fromUriString(uri);
            this.headers = new HttpHeaders();
        }

        RestClientBuilder(String scheme, String host, int port) {
            this.componentsBuilder = UriComponentsBuilder.newInstance().scheme(scheme).host(host).port(port);
            this.headers = new HttpHeaders();
        }

        public RestClientBuilder path(Object path) {
            this.componentsBuilder.pathSegment(path.toString());
            return this;
        }

        public RestClientBuilder addHeader(String key, String value) {
            this.headers.add(key, value);
            return this;
        }

        public RestClientBuilder addHeaders(Map<String, String> headers) {
            headers.entrySet().stream().forEach(entry -> addHeader(entry.getKey(), entry.getValue()));
            return this;
        }

        public RestClientBuilder addUrlParameter(String key, Object value) {
            this.componentsBuilder.queryParam(key, value.toString());
            return this;
        }

        public RestClientBuilder addUrlParameters(Map<String, ? extends Object> parameters) {
            parameters.entrySet().stream().forEach(entry -> addUrlParameter(entry.getKey(), entry.getValue()));
            return this;
        }

        public RestClientBuilder accepts(MediaType... mediaTypes) {
            return addHeader("Accepts", MediaType.toString(Sets.newHashSet(mediaTypes)));
        }

        public RestClientBuilder contentType(MediaType contentType) {
            return addHeader("Content-Type", MediaType.toString(Sets.newHashSet(contentType)));
        }

        public RestClientBuilder payload(Object payload) {
            this.payload = payload;
            return this;
        }

        public <S> ResponseEntity<S> get(Class<S> responseClass) {
            return doExchange(GET, responseClass);
        }

        public <S> ResponseEntity<S> post(Class<S> responseClass) {
            return doExchange(POST, responseClass);
        }

        public <S> ResponseEntity<S> put(Class<S> responseClass) {
            return doExchange(PUT, responseClass);
        }

        public <S> ResponseEntity<S> delete(Class<S> responseClass) {
            return doExchange(DELETE, responseClass);
        }

        protected <S> ResponseEntity<S> doExchange(HttpMethod method, Class<S> responseClass) {
            URI uri = componentsBuilder.build().encode().toUri();
            log.debug("rest_client", "Calling {} with {} method", uri, method);

            return restTemplate
                    .exchange(uri, method, new HttpEntity<>(payload, headers), responseClass);
        }
    }

}