"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: Props) {
  const { addProject } = useProjectStore();
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    value: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProject({
      id: crypto.randomUUID(),
      name: formData.name,
      client: formData.client,
      value: Number(formData.value),
      description: formData.description,
      status: "planning",
      tasks: [],
      createdAt: new Date().toISOString(),
    });

    onClose();
    setFormData({ name: "", client: "", value: "", description: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Fundo escurecido) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121214] border border-[#27272a] w-full max-w-lg rounded-3xl p-8 relative shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">
                Novo Projeto
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-zinc-400 block mb-2">
                    Nome do Projeto
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: E-commerce de Moda"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-400 block mb-2">
                      Cliente
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      placeholder="Nome do cliente"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-400 block mb-2">
                      Valor (R$)
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      placeholder="Ex: 5000"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-400 block mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="O que será feito?"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  Criar Projeto
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
