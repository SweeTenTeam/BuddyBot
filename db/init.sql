DROP TABLE IF EXISTS ziomela;

CREATE TABLE ziomela(
    id VARCHAR(36) PRIMARY KEY,
    question VARCHAR(5000),
    questionDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    answer VARCHAR(5000),
    answerDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ziomela(id,question,answer) VALUES ('7a85a871-e511-4838-91a5-3e0cf3c338a7','Question','Answer');
