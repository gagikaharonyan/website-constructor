import {Popconfirm, Button} from 'antd';
import React from "react";

export default function (props, handelEditPost, handelDeletePost) {
    return [
        {
            title: 'Heading',
            dataIndex: 'HEADING',
            key: Math.random(),
            sorter: (a, b) => {
                const strA = a.HEADING || '';
                const strB = b.HEADING || '';
                return strA.localeCompare(strB)
            },
        },
        {
            title: 'Quote',
            dataIndex: 'QUOTE',
            key: Math.random(),
            sorter: (a, b) => {
                const strA = a.type || '';
                const strB = b.type || '';
                return strA.localeCompare(strB)
            }
        },
        {
            title: 'Video',
            dataIndex: 'VIDEO',
            key: Math.random(),

            render: video => (
                // eslint-disable-next-line
                <a target="_blank"
                   href={video}
                   className="utils__link--underlined utils__link--blue"
                >
                    {video}
                </a>
            ),
        },
        {
            title: 'Action',
            key: 'actions',
            width: '200px',
            render: (text, record) => (
                <span>
                        <Button onClick={() => handelEditPost(record)} type="primary">
                            Edit
                        </Button>

                    <Popconfirm title="Confirm delete" onConfirm={() => handelDeletePost(record.id)}>
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];
}