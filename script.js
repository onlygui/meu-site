// Variáveis globais
let editor;
let currentProject = '1';
let currentFile = 'main.lua';
let isRunning = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    loadDefaultProject();
});

// Inicializar Monaco Editor
function initializeEditor() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
    
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: `-- Onlyguii Studio - Editor Lua para Roblox
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

-- Função de exemplo
local function welcomePlayer(player)
    print("Jogador entrou: " .. player.Name)
    
    -- Criar uma part para o jogador
    local part = Instance.new("Part")
    part.Name = player.Name .. "_Part"
    part.Position = Vector3.new(0, 10, 0)
    part.Size = Vector3.new(5, 5, 5)
    part.BrickColor = BrickColor.new("Bright blue")
    part.Parent = Workspace
    
    return part
end

-- Conectar eventos
Players.PlayerAdded:Connect(welcomePlayer)

-- Processar jogadores já conectados
for _, player in ipairs(Players:GetPlayers()) do
    welcomePlayer(player)
end

print("Sistema inicializado com sucesso!")`,
            language: 'lua',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on'
        });

        // Atualizar informação da linha
        editor.onDidChangeCursorPosition(function(e) {
            document.getElementById('currentLine').textContent = e.position.lineNumber;
        });

        // Marcar como não salvo quando o conteúdo mudar
        editor.onDidChangeModelContent(function() {
            // Em uma implementação real, você mostraria um indicador de "não salvo"
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botões da toolbar
    document.getElementById('saveBtn').addEventListener('click', saveFile);
    document.getElementById('runBtn').addEventListener('click', runScript);
    document.getElementById('stopBtn').addEventListener('click', stopScript);
    document.getElementById('exportBtn').addEventListener('click', exportProject);
    document.getElementById('studioBtn').addEventListener('click', openInStudio);
    
    // Botões da sidebar
    document.getElementById('newProjectBtn').addEventListener('click', showNewProjectModal);
    document.getElementById('newFileBtn').addEventListener('click', showNewFileModal);
    document.getElementById('pluginBtn').addEventListener('click', showPluginModal);
    
    // Navegação de projetos e arquivos
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', function() {
            switchProject(this.dataset.project);
        });
    });
    
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', function() {
            switchFile(this.dataset.file);
        });
    });
    
    // Abas do painel de teste
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Console
    document.getElementById('consoleInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeConsoleCommand(this.value);
            this.value = '';
        }
    });
    
    document.getElementById('consoleSend').addEventListener('click', function() {
        const input = document.getElementById('consoleInput');
        executeConsoleCommand(input.value);
        input.value = '';
    });
    
    // Modais - Projeto
    document.getElementById('closeProjectModal').addEventListener('click', hideNewProjectModal);
    document.getElementById('cancelProjectBtn').addEventListener('click', hideNewProjectModal);
    document.getElementById('createProjectBtn').addEventListener('click', createNewProject);
    
    // Modais - Arquivo
    document.getElementById('closeFileModal').addEventListener('click', hideNewFileModal);
    document.getElementById('cancelFileBtn').addEventListener('click', hideNewFileModal);
    document.getElementById('createFileBtn').addEventListener('click', createNewFile);
    
    // Modais - Plugin
    document.getElementById('closePluginModal').addEventListener('click', hidePluginModal);
    document.getElementById('closePluginBtn').addEventListener('click', hidePluginModal);
}

// Carregar projeto padrão
function loadDefaultProject() {
    switchProject('1');
    switchFile('main.lua');
}

// Funções de Projeto
function switchProject(projectId) {
    // Atualizar UI
    document.querySelectorAll('.project-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.project-item[data-project="${projectId}"]`).classList.add('active');
    
    currentProject = projectId;
    document.getElementById('currentProject').textContent = 
        document.querySelector(`.project-item[data-project="${projectId}"] .project-name`).textContent;
    
    // Em uma implementação real, carregaria o projeto do servidor
    console.log(`Projeto carregado: ${projectId}`);
}

function switchFile(fileName) {
    // Atualizar UI
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.file-item[data-file="${fileName}"]`).classList.add('active');
    
    currentFile = fileName;
    document.getElementById('currentFile').textContent = fileName;
    
    // Em uma implementação real, carregaria o arquivo do servidor
    console.log(`Arquivo carregado: ${fileName}`);
}

// Funções do Editor
function saveFile() {
    if (!editor) return;
    
    const content = editor.getValue();
    
    // Simular salvamento
    addConsoleMessage('Arquivo salvo com sucesso', 'success');
    
    // Em uma implementação real, enviaria para o servidor
    console.log('Salvando arquivo:', content);
}

function runScript() {
    if (!editor) return;
    
    const code = editor.getValue();
    
    // Atualizar UI
    isRunning = true;
    document.getElementById('runBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'flex';
    document.getElementById('executionStatus').textContent = 'Executando';
    document.getElementById('executionStatus').className = 'status-running';
    
    // Limpar console
    clearConsole();
    addConsoleMessage('Executando script...', 'info');
    
    // Simular execução
    setTimeout(() => {
        simulateLuaExecution(code);
        addConsoleMessage('Script executado com sucesso', 'success');
        updateVisualization(code);
    }, 1000);
}

function stopScript() {
    isRunning = false;
    document.getElementById('runBtn').style.display = 'flex';
    document.getElementById('stopBtn').style.display = 'none';
    document.getElementById('executionStatus').textContent = 'Parado';
    document.getElementById('executionStatus').className = 'status-stopped';
    
    addConsoleMessage('Execução interrompida', 'warning');
}

function exportProject() {
    if (!editor) return;
    
    const content = editor.getValue();
    const projectData = {
        name: "Projeto Onlyguii",
        scripts: [
            {
                name: currentFile,
                source: content
            }
        ],
        metadata: {
            exportedAt: new Date().toISOString(),
            version: "1.0"
        }
    };
    
    // Criar e baixar arquivo
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'onlyguii-project.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addConsoleMessage('Projeto exportado com sucesso', 'success');
}

function openInStudio() {
    addConsoleMessage('Funcionalidade de integração com Roblox Studio', 'info');
    // Em uma implementação real, se comunicaria com o plugin
}

// Funções do Console
function executeConsoleCommand(command) {
    if (!command.trim()) return;
    
    addConsoleMessage(`> ${command}`, 'info');
    
    // Simular execução de comando
    setTimeout(() => {
        if (command === 'clear') {
            clearConsole();
        } else if (command.startsWith('print ')) {
            const message = command.substring(6);
            addConsoleMessage(message, 'info');
        } else {
            addConsoleMessage(`Comando executado: ${command}`, 'success');
        }
    }, 100);
}

function addConsoleMessage(message, type = 'info') {
    const consoleOutput = document.getElementById('consoleOutput');
    const messageElement = document.createElement('div');
    messageElement.className = `console-message ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    messageElement.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
    
    consoleOutput.appendChild(messageElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML = '';
    addConsoleMessage('Console limpo', 'info');
}

// Simulação de execução Lua
function simulateLuaExecution(code) {
    // Simular prints
    const printMatches = code.match(/print\(["']([^"']+)["']\)/g);
    if (printMatches) {
        printMatches.forEach(match => {
            const message = match.match(/print\(["']([^"']+)["']\)/)[1];
            addConsoleMessage(message, 'info');
        });
    }
    
    // Simular criação de objetos
    if (code.includes('Instance.new')) {
        addConsoleMessage('Criando instâncias Roblox...', 'success');
    }
    
    // Simular serviços
    if (code.includes('GetService')) {
        addConsoleMessage('Acessando serviços do jogo...', 'info');
    }
}

// Atualizar visualização
function updateVisualization(code) {
    const visualizationArea = document.getElementById('visualizationArea');
    
    // Simular objetos criados
    let html = `
        <div class="object-list">
            <h4>Objetos no Workspace</h4>
    `;
    
    if (code.includes('Instance.new("Part")')) {
        html += `
            <div class="object-item">
                <strong>Part</strong> - Player1_Part
                <div class="object-props">
                    Posição: (0, 10, 0)<br>
                    Tamanho: (5, 5, 5)<br>
                    Cor: Azul
                </div>
            </div>
        `;
    }
    
    if (code.includes('Script')) {
        html += `
            <div class="object-item">
                <strong>Script</strong> - MainScript
                <div class="object-props">
                    Ativo: Sim<br>
                    Habilitado: Sim
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    visualizationArea.innerHTML = html;
}

// Funções de Abas
function switchTab(tabName) {
    // Atualizar botões das abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    
    // Atualizar conteúdo das abas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Funções de Modal
function showNewProjectModal() {
    document.getElementById('newProjectModal').style.display = 'flex';
}

function hideNewProjectModal() {
    document.getElementById('newProjectModal').style.display = 'none';
}

function showNewFileModal() {
    document.getElementById('newFileModal').style.display = 'flex';
}

function hideNewFileModal() {
    document.getElementById('newFileModal').style.display = 'none';
}

function showPluginModal() {
    document.getElementById('pluginModal').style.display = 'flex';
}

function hidePluginModal() {
    document.getElementById('pluginModal').style.display = 'none';
}

function createNewProject() {
    const name = document.getElementById('projectName').value;
    const template = document.getElementById('projectTemplate').value;
    
    if (!name) {
        alert('Por favor, digite um nome para o projeto');
        return;
    }
    
    // Adicionar à lista de projetos
    const projectList = document.getElementById('projectList');
    const newProject = document.createElement('li');
    newProject.className = 'project-item';
    newProject.dataset.project = Date.now().toString();
    newProject.innerHTML = `
        <span class="project-icon">📁</span>
        <span class="project-name">${name}</span>
    `;
    
    newProject.addEventListener('click', function() {
        switchProject(this.dataset.project);
    });
    
    projectList.appendChild(newProject);
    
    hideNewProjectModal();
    addConsoleMessage(`Projeto "${name}" criado`, 'success');
}

function createNewFile() {
    const name = document.getElementById('fileName').value;
    
    if (!name) {
        alert('Por favor, digite um nome para o arquivo');
        return;
    }
    
    // Adicionar à árvore de arquivos
    const fileTree = document.getElementById('fileTree');
    const newFile = document.createElement('li');
    newFile.className = 'file-item';
    newFile.dataset.file = name;
    
    // Determinar ícone baseado na extensão
    const icon = name.endsWith('.lua') ? '📄' : name.endsWith('.json') ? '⚙️' : '📝';
    
    newFile.innerHTML = `
        <span class="file-icon">${icon}</span>
        <span class="file-name">${name}</span>
    `;
    
    newFile.addEventListener('click', function() {
        switchFile(this.dataset.file);
    });
    
    fileTree.appendChild(newFile);
    
    hideNewFileModal();
    addConsoleMessage(`Arquivo "${name}" criado`, 'success');
}
