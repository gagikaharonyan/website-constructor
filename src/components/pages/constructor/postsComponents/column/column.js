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
            title: 'Title',
            dataIndex: 'title',
            key: Math.random(),
            sorter: (a, b) => {
                const strA = a.title || '';
                const strB = b.title || '';
                return strA.localeCompare(strB)
            }
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: Math.random(),
            sorter: (a, b) => {
                const strA = a.category || '';
                const strB = b.category || '';
                return strA.localeCompare(strB)
            }
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