-- leetcode db design

create table users{
    id int  auto_increment primary key,
    password varchar(50) not null,
    profile_pic varchar(255) not null,
    user_name varchar(25) not null,
    email varchar(255) not null,
    created_at timestamp default default_current_timestamp,
    updated_at timestamp default on update current_timestamp
}

create table problems{
    id int auto_increment primary key,
    problem_id int unique, --specific number assigned to problem based on category,problems ...
    description varchar(5000) not null,
    constraint fk_constraint foreign key tag_id references tags(id)
}

create table testcases{
    id int auto_increment primary key,
    problem_id int not null,
    test_case varchar(50) not null -- s3 url
    constraint fk_key_prob_test_cases foreign key problem_id references problems(id)
}

create table tags{
 id int auto_increment primary key,
 problem_id int  not null,
 tag varchar(50) not null,
 constraint fk_key_prob_tags  foreign key problem_id references problems(id)
}

create table tag{
    id int auto_increment primary key,
    tag_name varchar(50) not null
}

create table submissions{
    id int auto_increment primary key,
    problem_id int not null, 
    user_id int not null,
    solution varchar(5000) not null,
    lang_id  int  not null
    status enum('pending','success','failure','run time error','time limit exceeded','memory limit execeeded') not null, 
    constraint fk_key_prob_id foreign key problem_id references problems(id),
    constraint fk_key_user_id foreign key user_id references user(id)
    constraint fk_key_lang_id foreign key lang_id references language(id)
}

create table language{
    id int auto_increment primary key,
    language varchar(50) not null
}