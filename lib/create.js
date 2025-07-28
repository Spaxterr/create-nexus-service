const fs = require('fs-extra');
const path = require('path');
const prompts = require('@clack/prompts');
const chalk = require('chalk');

const c = new chalk.Chalk();

async function create(projectName, options = {}) {
    try {
        prompts.intro('Create new NexusNF service');

        // Get project name if not provided
        if (!projectName) {
            const response = await prompts.text({
                message: 'Service name',
                placeholder: 'my-service',
                validate: value => {
                    const trimmed = value?.toLowerCase?.()?.trim?.();
                    if (!trimmed) return 'Service name is required';
                    if (!/^[a-z0-9-_]+$/.test(trimmed)) {
                        return 'Service name can only contain lowercase letters, numbers, hyphens, and underscores';
                    }
                    return undefined;
                }
            });

            if (prompts.isCancel(response)) {
                prompts.cancel('Operation cancelled.');
                process.exit(0);
            }

            projectName = response.toLowerCase().trim().replace(/\s+/g, '-');
        }

        const projectPath = path.resolve(process.cwd(), projectName);

        // Check if directory exists
        if (await fs.pathExists(projectPath)) {
            const overwrite = await prompts.confirm({
                message: `Directory ${projectName} already exists. Overwrite?`,
                initialValue: false
            });

            if (prompts.isCancel(overwrite)) {
                prompts.cancel('Operation cancelled.');
                process.exit(0);
            }

            if (!overwrite) {
                prompts.outro('Operation cancelled.');
                return;
            }

            await fs.remove(projectPath);
        }

        // Feature selection with corrected values
        const features = await prompts.multiselect({
            message: 'Additional features and tools',
            options: [
                {
                    label: 'Zod',
                    value: 'zod',
                    hint: 'Runtime data validation - https://zod.dev'
                },
                {
                    label: 'ESLint',
                    value: 'eslint',
                    hint: 'Linter - https://eslint.org'
                },
                {
                    label: 'Prettier',
                    value: 'prettier',
                    hint: 'Formatter - https://prettier.io'
                },
            ],
            required: false,
        });

        if (prompts.isCancel(features)) {
            prompts.cancel('Operation cancelled.');
            process.exit(0);
        }

        const s = prompts.spinner();
        s.start('Generating project...');

        // Verify template exists
        const templatePath = path.join(__dirname, '..', 'templates', 'default');
        if (!(await fs.pathExists(templatePath))) {
            s.stop('Template not found!');
            prompts.outro(c.red(`Template directory not found: ${templatePath}`));
            return;
        }

        // Copy template
        await fs.copy(templatePath, projectPath);

        // Update package.json
        await updatePackageJson(projectPath, projectName, features);

        // Remove unwanted config files
        await removeUnwantedFiles(projectPath, features);

        // Update template placeholders
        await updateTemplateFiles(projectPath, projectName);

        s.stop('Project generated successfully!');

        // Success message
        prompts.outro(`${c.green('✅ All done! Your new service is ready')}

${c.dim('To get started:')}
  ${c.cyan('cd')} ${projectName}
  ${c.cyan('npm install')} ${c.dim('(or yarn, pnpm, bun etc.)')}
  ${c.cyan('npm run dev')}
        `);

    } catch (error) {
        prompts.cancel(`Error: ${error.message}`);
        console.error(c.red('Full error:'), error);
        process.exit(1);
    }
}

async function updatePackageJson(projectPath, projectName, features) {
    const packageJsonPath = path.join(projectPath, 'package.json');

    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;

    if (!features.includes('zod')) {
        delete packageJson.dependencies.zod;
    }

    if (!features.includes('eslint')) {
        const eslintPackages = [
            'eslint',
            'typescript-eslint',
            '@eslint/compat',
            '@eslint/js',
            '@typescript-eslint/eslint-plugin',
            '@typescript-eslint/parser',
            'eslint-config-prettier'
        ];

        eslintPackages.forEach(pkg => {
            if (packageJson.devDependencies?.[pkg]) {
                delete packageJson.devDependencies[pkg];
            }
        });

        delete packageJson.scripts['lint'];
    }

    if (!features.includes('prettier')) {
        const prettierPackages = [
            'prettier',
        ];

        prettierPackages.forEach(pkg => {
            if (packageJson.devDependencies?.[pkg]) {
                delete packageJson.devDependencies[pkg];
            }
        });

        delete packageJson.scripts['format'];
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function removeUnwantedFiles(projectPath, features) {
    const filesToRemove = [];

    if (!features.includes('eslint')) {
        filesToRemove.push(
            path.join(projectPath, 'eslint.config.js'),
            path.join(projectPath, '.eslintignore')
        );
    }

    if (!features.includes('prettier')) {
        filesToRemove.push(
            path.join(projectPath, 'prettier.config.cjs'),
            path.join(projectPath, '.prettierignore')
        );
    }

    // Remove files that exist
    for (const filePath of filesToRemove) {
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
        }
    }
}

async function updateTemplateFiles(projectPath, projectName) {
    const filesToUpdate = [
        path.join(projectPath, 'src', 'index.ts'),
        path.join(projectPath, 'README.md'),
    ];

    for (const filePath of filesToUpdate) {
        if (await fs.pathExists(filePath)) {
            let content = await fs.readFile(filePath, 'utf8');

            content = content
                .replace(/%project_name%/g, projectName)

            await fs.writeFile(filePath, content, 'utf8');
        }
    }
}

module.exports = create;
