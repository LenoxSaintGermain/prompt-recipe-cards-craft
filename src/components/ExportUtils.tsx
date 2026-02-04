import html2canvas from 'html2canvas';

export const exportToPNG = async (elementId: string, filename: string, isSlideMode: boolean = false) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for export');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const link = document.createElement('a');
    link.download = `${filename}${isSlideMode ? '_slide' : ''}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
  }
};

export const exportToMarkdown = (card: any, filename: string) => {
  console.log('Exporting to Markdown:', card.name, filename);
  try {
    let markdown = `# ${card.name}\n\n`;
    
    if (card.difficulty) {
      markdown += `**Difficulty:** ${card.difficulty}\n\n`;
    }
    
    markdown += `## What it does\n${card.whatItDoes}\n\n`;
    
    markdown += `## Who it's for\n${card.whoItsFor}\n\n`;
    
    markdown += `## How it's done\n`;
    card.steps.forEach((step: string, index: number) => {
      markdown += `${index + 1}. ${step}\n`;
    });
    markdown += '\n';
    
    if (card.examplePrompts && card.examplePrompts.length > 0) {
      markdown += `## Example Prompts\n`;
      card.examplePrompts.forEach((example: any, index: number) => {
        markdown += `### ${example.title || `Example ${index + 1}`}\n`;
        markdown += '```\n';
        markdown += `${example.prompt}\n`;
        markdown += '```\n\n';
      });
    }
    
    if (card.exampleInAction) {
      markdown += `## Example in Action\n${card.exampleInAction}\n\n`;
    }
    
    if (card.promptTemplate) {
      markdown += `## Prompt Template\n`;
      markdown += '```\n';
      markdown += `${card.promptTemplate}\n`;
      markdown += '```\n\n';
    }
    
    if (card.perplexityChatLink) {
      markdown += `## Try it Live\n[Open Demo](${card.perplexityChatLink})\n\n`;
    }
    
    if (card.tips && card.tips.length > 0) {
      markdown += `## Tips for Best Results\n`;
      card.tips.forEach((tip: string) => {
        markdown += `- ${tip}\n`;
      });
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.md`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('Markdown export completed successfully');
  } catch (error) {
    console.error('Error exporting to Markdown:', error);
  }
};
