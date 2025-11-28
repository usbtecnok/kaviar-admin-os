/** @type {import('next').NextConfig} */
const nextConfig = {
    // Apenas a configuracao basica. Headers async garante que o Next.js reavalie as rotas.
    async headers() {
        return [
            {
                source: '/motoristas',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
