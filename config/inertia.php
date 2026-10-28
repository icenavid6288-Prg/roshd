<?php

return [
    // Match the case-sensitive directory used by the React page resolver.
    'pages' => [
        'ensure_pages_exist' => false,
        'paths' => [resource_path('js/Pages')],
        'extensions' => ['tsx', 'jsx', 'ts', 'js'],
    ],
];
