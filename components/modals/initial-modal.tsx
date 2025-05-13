"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage, FormLabel} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as React from "react";
import { FileUpload } from "@/components/file-upload";
import axios from 'axios';
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, "Server name is required"),
    imageUrl: z.string().min(1, "Server image is required"),
}); 
    
export const InitialModal = () => { 
    const [isMounted, setIsMounted] = React.useState(false);

    const router = useRouter();
    
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try { 
            await axios.post('/api/servers', values)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error);
                });

            form.reset();
            router.refresh()
            window.location.reload();
        } catch (error) {
            console.error(error)
        }
    }

    if(!isMounted) {
        return null;
    }

    return (
        <Dialog open={true}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 italic">
                        xaxaxa
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="spacef-y-8 px-6">
                            <div className="flex justify-center px-6">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField control={form.control} name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase pt-3 text-xs font-bold text-zinc-500 dark:text-secondary-500">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} 
                                            className="bg-zinc-300/50 border-2
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0
                                                placeholder:italic placeholder:text-sm placeholder:text-zinc-500"
                                            placeholder="Enter server name"
                                            {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs italic text-red-500"/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-300 px-6 py-2 flex justify-center">
                            <Button className="w-1/3 bg-purple-500 border-purple-950 border-2 hover:bg-orange-400 px-4 py-2 text-sm"  disabled={isLoading}>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}