import { DiscordUserView } from "@services/supabase/types/views/DiscordUserView";
import { CacheType, ChatInputCommandInteraction, StringSelectMenuInteraction, VoiceBasedChannel } from "discord.js";

declare global{
  namespace Express {
    interface Request {
      user?: DiscordUserView; 
    }
  }
  
  namespace ChrezBot{
    interface ChatContext{
      command: string;
      args: string[];
      prefix: string;

      subCommand?: {
        command: string;
        rest: string[];
      };

      user?: DiscordUserView;
      voiceChannel?: VoiceBasedChannel;
    }
    
    interface SlashContext{
      user?: DiscordUserView;
      voiceChannel?: VoiceBasedChannel;

      chatInteraction: ChatInputCommandInteraction<CacheType>;
      stringSelectMenuInteraction: StringSelectMenuInteraction<CacheType>;
    }
  }

  namespace CustomMiddleware {
      // Users will augment this interface globally
      interface Context {
        name: string;
      }
  }
}

